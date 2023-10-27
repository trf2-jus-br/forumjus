import EnunciadoDAO from "../../../db/enunciado";
import { apiHandler } from "../../../utils/apis";

async function listar({req, res, db, usuario} : API){
    const dia = parseInt(req.query['dia']);

    res.send(
        await EnunciadoDAO.listarPorVotacao(db, usuario, dia)
    )
}

export default apiHandler({
    GET: listar
})