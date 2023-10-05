import createHttpError from "http-errors";
import pool from './mysql';

import type { NextApiRequest, NextApiResponse } from "next";
import { PoolConnection } from 'mysql2/promise';
import jwt from './jwt';

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
            usuario = await validarSessao(req);

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


async function validarSessao(req: NextApiRequest) : Promise<Usuario | null>{
     // verifico se estou tentado acessar é uma das rotas publicas.
     const rota_publica = rotas_publicas.some(r => r === req.url);

     try {
         return await jwt.parseJwt( req.cookies['forum_token'] ) as any;
     } catch(err) {
        // no caso de rotas protegidas, verifico se o usuário está autenticado.
        if(!rota_publica){
             throw createHttpError.Forbidden(null)    
        }
    }
}