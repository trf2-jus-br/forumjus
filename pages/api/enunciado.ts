import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";
import { carregarUsuario } from "../../middleware";

async function editar(req: NextApiRequest, res: NextApiResponse){
    const {committee_id, statement_id} = req.body;
    const usuario = await carregarUsuario(req);
    await mysql.alterarComite({usuario, committee_id, statement_id});

    res.send(null)
}

export default apiHandler({
    "PUT" : editar,
}) 