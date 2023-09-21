import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../utils/apis";
import mysql from "../../../utils/mysql";
import mailer from '../../../utils/mailer';

async function validarPermissao(req: NextApiRequest){
    const doc = req.cookies['doc'];

    if(!doc)
        throw "Usuário não está logado no gov.br"

    return doc;
}

async function listar(req: NextApiRequest, res: NextApiResponse){
    const doc = await validarPermissao(req);

    
    const result = await mysql.carregarVotacaoComites(doc);
    res.send(result)
}

async function votar(req: NextApiRequest, res: NextApiResponse){
    const usuario = await validarPermissao(req);

    const { statement_id, committee_id, contra } = JSON.parse(req.body);
    
    const result = await mysql.votar({usuario, statement_id, contra, committee_id});
    res.send(result)
}

export default apiHandler({
    "GET" : listar,
    "POST": votar
}) 