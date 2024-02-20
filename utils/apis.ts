import createHttpError from "http-errors";
import pool from './mysql';

import type { NextApiRequest, NextApiResponse } from "next";
import { PoolConnection } from 'mysql2/promise';
import jwt from './jwt';
import LogDAO from "../db/log";

type Method =
  |'GET'
  |'DELETE'
  |'HEAD'
  |'OPTIONS'
  |'POST'
  |'PUT'
  |'PATCH'
  |'PURGE'
  |'LINK'
  |'UNLINK';


type ApiMethodHandlers = {
    [key in Method]?: (api: API)=> any;
};

function errorHandler(err: unknown, res: NextApiResponse) {
    // Errors with statusCode >= 500 are should not be exposed
    if (createHttpError.isHttpError(err) && err.expose) {
        // Handle all errors thrown by http-errors module
        return res.status(err.statusCode).json({ error: { message: err.message } });
    } else {
        return res.status(500).json({
            error: { message: "Internal Server Error", err: err },
            status: createHttpError.isHttpError(err) ? err.statusCode : 500,
        });
    }
}

/*
    Cada arquivo dentro da pasta '/pages/api' utiliza este método para criar suas api's.
    Este método funciona como um 'interceptor' fazendo verificações e tratamento antes de executar as funções reais.
*/
export function apiHandler(handler: ApiMethodHandlers) {


    return async (req: NextApiRequest, res: NextApiResponse) => {
        let db : PoolConnection = null;
        let usuario : Usuario = null; 
        
        try {
            // abre uma conexão e inicia uma transação.
            db = await pool.getConnection();
            db.beginTransaction();

            // Visando analisar a estabilidade do sistema, lanço exceções intencionamente.
            if(process.env.HOMOLOGACAO === "true" && process.env.TEORIA_DO_CAOS === "true"){
                const r = Math.random();                 
                if(r > 0.8){
                    switch(Math.floor(Math.random() * 4 )){
                        case 0: throw new Error("Teoria do Caos - Error");
                        case 1: throw "Teoria do Caos - String";
                        case 2: throw createHttpError.BadRequest("Teoria do Caos - Bad Request");
                        case 3: throw createHttpError.InternalServerError("Teoria do Caos - Internal Server Error");
                    }
                }
            }

            // valida o JWT e carrega o usuário presente nele.
            usuario = await carregarUsuario(req);

            //define a função que deve ser executada.
            const methodHandler = handler[req.method as Method];

            // verifica se método está associado a alguma função.
            if (!methodHandler){
                throw new createHttpError.MethodNotAllowed(
                    `Método ${req.method} não permitido no caminho ${req.url}!`
                );
            }

            // tenta executar a api
            const resposta = await methodHandler({req, res, db, usuario});

            // caso tudo ocorra bem, salva as informações no banco.
            db.commit();

            // envia a resposta pro usuário.
            if(!res.headersSent){
                res.send(resposta);
            }
        } catch (err) {
            // em caso de erro, desfaz as alterações propostas pela api no banco de dados.
            db?.rollback();

            // tento registrar o problema ocorrido
            try{
                db.beginTransaction();
                await LogDAO.registrar(db, usuario, "Erro", JSON.stringify({
                    message: err.message,
                    stack: err.stack,
                }));
                db.commit();
            }catch(err){
                console.log("Não foi possível registrar o log.", err);
            }

            // formata a mensagem que será enviada pra página web.
            errorHandler(err, res);
        } finally {
            // libera a conexão.
            db?.release();
        }
    };

}

export function apiPermitidaAo(usuario?: Usuario, ...funcoes_permitidas: FuncaoMembro[]){
    if(!usuario)
        throw createHttpError("Rota privada.");

    if(funcoes_permitidas.indexOf(usuario.funcao) === -1){
        throw createHttpError(`${usuario.funcao} não tem permissão para acessar a api.`);
    }
}

export function apiNegadaAo(usuario?: Usuario, ...funcoes_permitidas: FuncaoMembro[]){
    if(!usuario)
        throw createHttpError("Rota privada.");

    if(funcoes_permitidas.indexOf(usuario.funcao) !== -1){
        throw createHttpError(`${usuario.funcao} não tem permissão para acessar a api.`);
    }
}
async function carregarUsuario(req: NextApiRequest) : Promise<Usuario | null>{
    try {
        return await jwt.parseJwt( req.cookies['forum_token'] ) as any;
    } catch(err) {
        return null;
    }
}