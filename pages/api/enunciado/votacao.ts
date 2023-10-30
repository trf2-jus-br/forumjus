import EnunciadoDAO from "../../../db/enunciado";
import { apiHandler } from "../../../utils/apis";

async function listar({req, res, db, usuario} : API){
    res.send(
        await EnunciadoDAO.listarPorVotacao(db, usuario)
    )
}

export default apiHandler({
    GET: listar
})