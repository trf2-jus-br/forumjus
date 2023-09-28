import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../utils/apis";
import mysql from "../../../utils/mysql";
import { carregarUsuario } from "../../../middleware";

async function listar(req: NextApiRequest, res: NextApiResponse){
    const usuario = await carregarUsuario(req);
    const result = await mysql.carregarVotacaoComites(usuario);
    res.send(result)
}

async function votar(req: NextApiRequest, res: NextApiResponse){
    const {matricula} = await carregarUsuario(req);

    const { statement_id, committee_id, contra } = JSON.parse(req.body);
    
    const result = await mysql.votar({matricula, statement_id, contra, committee_id});
    res.send(result)
}

export default apiHandler({
    "GET" : listar,
    "POST": votar
}) 