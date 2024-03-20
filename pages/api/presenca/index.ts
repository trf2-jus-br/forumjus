import PresencaDAO from "../../../db/presenca";
import { apiHandler } from "../../../utils/apis";

//TODO: ao invez de dar res.send retornar o resultado da função
async function criar({req, res, db, usuario}: API) {
    const presenca: Presenca = req.body;
    res.send(await PresencaDAO.marcarEntrada(db, usuario, presenca));
}

async function atualizar({req, res, db, usuario}: API) {
    const presenca: Presenca = req.body;
    res.send(await PresencaDAO.marcarSaida(db, usuario, presenca));
}

async function listar({req, res, db, usuario} : API){
    let comite = Number(req.query.comissaoId); 
    if (comite) {
        let saida = await PresencaDAO.listarMembrosPresentesPorComite(db, usuario, comite);
        res.send(saida);
    } else {
        let saida = await PresencaDAO.listarMembrosPresentes(db, usuario);
        res.send(saida);
    }
}

export default apiHandler({
    POST: criar,
    PUT: atualizar,
    GET: listar,
})
