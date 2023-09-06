import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../utils/apis";
import mysql from "../../../utils/mysql";

async function aprovar(req: NextApiRequest, res : NextApiResponse){
    const id = typeof req.body === "string" ? JSON.parse(req.body).id : req.body.id

    await mysql.aprovar(id)

    res.status(200).send(undefined)
}

export default apiHandler({
    "POST" : aprovar
})