import CadernoDAO from "../../db/caderno";
import { apiHandler } from "../../utils/apis";

enum CADERNO{
    TODOS = -1,
    ADMITIDO = 0,
    PRIMEIRA_VOTACAO = 1,
    SEGUNDA_VOTACAO = 2,
}

async function caderno({req, res, usuario, db} : API){
    const nivel = parseInt(req.query.nivel);
    const comissao = parseInt(req.query.comissao) || null;

    if(nivel === CADERNO.TODOS)
        return CadernoDAO.cadernoTodasInscricoes(db, usuario, comissao);

    if(nivel === CADERNO.ADMITIDO)
        return CadernoDAO.cadernoPrelinar(db, usuario, comissao);

    return CadernoDAO.cadernoVotacao(db, usuario, comissao, nivel);
}

export default apiHandler({
    "GET": caderno
})