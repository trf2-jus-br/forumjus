import EnunciadoDAO from "../../../db/enunciado";
import { apiHandler, apiPermitidaAo } from "../../../utils/apis";

async function listar({req, res, db, usuario} : API){
    apiPermitidaAo(usuario, "PRESIDENTA", "PRESIDENTE", "RELATOR", "RELATORA");

    return await EnunciadoDAO.listarPorVotacao(db, usuario)
}

export default apiHandler({
    GET: listar
})