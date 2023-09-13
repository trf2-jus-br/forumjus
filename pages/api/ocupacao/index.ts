import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../utils/apis";
import mysql from "../../../utils/mysql";

async function listar(req: NextApiRequest, res: NextApiResponse){
    const result = await mysql.carregarOcupacao()
    res.send(result)
}

async function editar(req: NextApiRequest, res: NextApiResponse){
    const {linha, coluna, valor, usuario} = JSON.parse(req.body); 

    await mysql.atualizarBanco({
        tabela: "occupation",
        nome_id: "occupation_id",
        id : linha["occupation_id"],
        coluna, 
        valor, 
        usuario
    })

    res.status(200).send(null);
}

async function deletar(req: NextApiRequest, res: NextApiResponse){
    const {linha, usuario} = JSON.parse(req.body); 

    await mysql.deletarLinha({
        tabela: "occupation",
        nome_id: "occupation_id",
        id : linha["occupation_id"],
        usuario
    })

    res.status(200).send(null);
}

export default apiHandler({
    "GET" : listar,
    "PATCH": editar,
    "DELETE" : deletar
}) 