import EnunciadoDAO from "../../../db/enunciado";
import { apiHandler } from "../../../utils/apis";

async function editar({req, res, db, usuario}: API){
    const {committee_id, statement_id} = req.body;

    await EnunciadoDAO.alterarComite(db, usuario, statement_id, committee_id);

    res.send(null)
}

async function listar({req, res, db, usuario} : API){
    const {id} = req.query;


    if(id != null){
        res.send(
            await EnunciadoDAO.listarPorId(db, usuario, id)
        );
    }else{
        res.send(
            await EnunciadoDAO.listar(db, usuario)
        );
    }

}

export default apiHandler({
    "PUT" : editar,
    GET: listar,
}) 