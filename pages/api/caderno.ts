import CadernoDAO from "../../db/caderno";
import { apiHandler } from "../../utils/apis";

async function caderno({req, res, usuario, db} : API){
    const nivel = parseInt(req.query.nivel);
    const comissao = parseInt(req.query.comissao);

    res.send(
        nivel ?
            await CadernoDAO.cadernoVotacao(db, usuario, comissao, nivel) :
            await CadernoDAO.cadernoPrelinar(db, usuario, comissao)
    )
}

export default apiHandler({
    "GET": caderno
})