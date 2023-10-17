import EnunciadoDAO from "../../db/enunciado";
import { apiHandler } from "../../utils/apis";

async function editar({req, res, db, usuario}: API){
    const {committee_id, statement_id} = req.body;

    await EnunciadoDAO.alterarComite(db, usuario, committee_id, statement_id);

    res.send(null)
}

async function listar({res, db, usuario} : API){
    res.send(
        await EnunciadoDAO.listar(db, usuario)
    );
}

export default apiHandler({
    "PUT" : editar,
    GET: listar,
}) 