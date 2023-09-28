import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";
import { carregarUsuario } from "../../middleware";

async function listar(req: NextApiRequest, res: NextApiResponse){
    const usuario = await carregarUsuario(req);
    const result = await mysql.carregarEnunciados({usuario});
    res.send(result)
}

async function analisar(req: NextApiRequest, res: NextApiResponse){
    const usuario = await carregarUsuario(req);
    const { statement_id, admitido } = req.body;
    
    const result = await mysql.analisar({usuario, statement_id, admitido});
    res.send(result)
}


async function desfazer(req: NextApiRequest, res: NextApiResponse){
    const usuario = await carregarUsuario(req);

    const { statement_id } = req.query;
    
    const result = await mysql.desfazerAnalise({usuario, statement_id });
    res.send(result)
}

export default apiHandler({
    "GET" : listar,
    "POST": analisar,
    "DELETE": desfazer,
}) 