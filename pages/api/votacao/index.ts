import VotacaoDAO from "../../../db/votacao";
import { apiHandler, apiNegadaAo, apiPermitidaAo } from "../../../utils/apis";

async function listar({res, usuario, db}: API){
    apiNegadaAo(usuario, "PROGRAMADOR", "ASSESSORIA");

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
    apiPermitidaAo(usuario, "PRESIDENTE", "PRESIDENTA", "RELATOR", "RELATORA");

    const {enunciado} = req.body;

    await VotacaoDAO.iniciar(db, usuario, enunciado);
    res.send(null);
}

async function pararVotacao({res, db, usuario} : API){
    await VotacaoDAO.parar(db, usuario);
    res.send(null);
}

export default apiHandler({
    GET: listar,
    POST: votar,
    PUT: iniciarVotacao,
    DELETE: pararVotacao,
})