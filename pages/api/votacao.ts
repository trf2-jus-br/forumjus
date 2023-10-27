import VotacaoDAO from "../../db/votacao";
import { apiHandler } from "../../utils/apis";

async function listar({res, usuario, db}: API){
    res.send(
        await VotacaoDAO.listar(db, usuario)
    )
}

async function votar({res, req, usuario, db}: API){
    const {favoravel, votacao} = req.body;

    await VotacaoDAO.votar(db, usuario, votacao, favoravel)
    res.send(null)
}

async function iniciarVotacao({res, req, usuario, db} : API){
    const {enunciado, dia} = req.body;

    await VotacaoDAO.iniciar(db, usuario, enunciado, dia);
    res.send(null);
}

export default apiHandler({
    GET: listar,
    POST: votar,
    PUT: iniciarVotacao,
})