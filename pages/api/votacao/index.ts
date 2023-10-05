import { apiHandler } from "../../../utils/apis";
import mysql from "../../../utils/mysql";
import ComiteDAO from "../../../db/comite";

async function listar({res, db, usuario}: API){
    res.send(
        await ComiteDAO.listar(db, usuario)
    )
}

async function votar({req, res, db, usuario}: API){
    const {matricula} = usuario;

    const { statement_id, committee_id, contra } = JSON.parse(req.body);
    
    const result = await mysql.votar({matricula, statement_id, contra, committee_id});
    res.send(result)
}

export default apiHandler({
    "GET" : listar,
    "POST": votar
}) 