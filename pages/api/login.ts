"use server"

import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";

async function logar(req: NextApiRequest, res: NextApiResponse){
    const nome = req.cookies['nome'];
    const doc = req.cookies['doc'];

    if(!nome || !doc)
        throw "Usuário não está logado no gov.br"

    const permissoes = await mysql.carregarPermissoes(doc);

    res.send({
        nome,
        doc,
        permissoes
    })
}

export default apiHandler({
    "GET": logar
})