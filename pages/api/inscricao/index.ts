import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../utils/apis";
import mysql from "../../../utils/mysql";

async function listar(req: NextApiRequest, res: NextApiResponse){
    const result = await mysql.carregarInscricoes()
    res.send(result)
}

async function editar(){

}

export default apiHandler({
    "GET" : listar,
    "PUT": editar
}) 