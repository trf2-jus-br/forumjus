"use server"

import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";


async function listar(req: NextApiRequest, res: NextApiResponse){
    const comites = await mysql.carregar({tabela: 'committee'});   
    res.status(200).send(comites);
}

export default apiHandler({
    "GET": listar
})