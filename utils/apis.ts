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
    console.log(err);

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

            // abre uma conexão e inicia uma transação.
            db = await pool.getConnection();
            db.beginTransaction();

            // tenta executar a api
            await methodHandler({req, res, db, usuario});

            // caso tudo ocorra bem, salva as informações no banco.
            db.commit();
        } catch (err) {
            // em caso de erro, desfaz as alterações propostas pela api no banco de dados.
            db?.rollback();

            // tento registrar o problema ocorrido
            try{
                console.log(err);
                db.beginTransaction();
                await LogDAO.registrar(db, usuario, "Erro", JSON.stringify(err));
                db.commit();
            }catch(err){
                console.log("Errrrr", err);
            }

            // formata a mensagem que será enviada pra página web.
            errorHandler(err, res);
        } finally {
            // libera a conexão.
            db?.release();
        }
    };

}

// defino as rotas que dispensam autenticação.
const rotas_publicas = [
    "/api/login", 
    "/api/register",
    "/api/forum",
    "/api/ocupacao",
    "/api/comite",
];


async function carregarUsuario(req: NextApiRequest) : Promise<Usuario | null>{
     // verifico se estou tentado acessar é uma das rotas publicas.
    //const url = req.url.replace(/\?.*/, '');
    //const rota_publica = rotas_publicas.some(r => r === url);

    try {
        return await jwt.parseJwt( req.cookies['forum_token'] ) as any;
    } catch(err) {
        return null;
        /*
        // no caso de rotas protegidas, verifico se o usuário está autenticado.
        if(!rota_publica){
            console.log(req.url, 'Rota privada!');
             throw createHttpError.Forbidden(null)    
        }
        */
    }
}