"use server"

import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";


async function listar(req: NextApiRequest, res: NextApiResponse){
    const forum = await mysql.carregarForum();   
    res.status(200).send(forum);
}

export default apiHandler({
    "GET": listar
})