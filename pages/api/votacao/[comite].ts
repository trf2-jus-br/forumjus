import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../utils/apis";
import mysql from "../../../utils/mysql";

async function validarPermissao(req: NextApiRequest){
    const doc = req.cookies['doc'];

    if(!doc)
        throw "Usuário não está logado no gov.br"

    return doc;
}

async function listar(req: NextApiRequest, res: NextApiResponse){
    const usuario = await validarPermissao(req);
    const {comite} = req.query
    
    const result = await mysql.carregarEnunciados({usuario, comite});
    res.send(result)
}

export default apiHandler({
    "GET" : listar,
}) 