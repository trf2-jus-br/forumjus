import EnunciadoDAO from "../../db/enunciado";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";

async function editar({req, res, db, usuario}: API){
    const {committee_id, statement_id} = req.body;

    await EnunciadoDAO.alterarComite(db, usuario, committee_id, statement_id);

    res.send(null)
}

export default apiHandler({
    "PUT" : editar,
}) 