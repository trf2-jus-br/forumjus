import VotacaoDAO from "../../../db/votacao";
import { apiHandler, apiNegadaAo, apiPermitidaAo } from "../../../utils/apis";

async function listar({usuario, db}: API){
    apiNegadaAo(usuario, "PROGRAMADOR", "ASSESSORIA");

    return await VotacaoDAO.listar(db, usuario)
}

async function votar({req, usuario, db}: API){
    const {favoravel, votacao} = req.body;

    return await VotacaoDAO.votar(db, usuario, votacao, favoravel)
}

async function alterarVotacao({req, usuario, db} : API){
    apiPermitidaAo(usuario, "PRESIDENTE", "PRESIDENTA", "RELATOR", "RELATORA");

    const {enunciado, estadoVotacao, cronometro} = req.body;

    const existe = await VotacaoDAO.existeVotacaoEmAndamento(db, enunciado);

    if(!existe){
        await VotacaoDAO.criar(db, usuario, enunciado);
    }

    return await VotacaoDAO.alterar(db, enunciado, estadoVotacao, cronometro);
}

async function pararVotacao({db, usuario} : API){
    return await VotacaoDAO.parar(db, usuario);
}

export default apiHandler({
    GET: listar,
    POST: votar,
    DELETE: pararVotacao,
    PATCH: alterarVotacao
})