import EnunciadoDAO from "../../../db/enunciado";
import { apiHandler, apiNegadaAo } from "../../../utils/apis";

async function resumo({res, db, usuario} : API){
    apiNegadaAo(usuario, "PROGRAMADOR", "ASSESSORIA");

    const enunciados_possiveis = (
        await EnunciadoDAO.listarPorVotacao(db, usuario)
    ).length;

    res.send({enunciados_possiveis})
}

export default apiHandler({
    "GET": resumo
})