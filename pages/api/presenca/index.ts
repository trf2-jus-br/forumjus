import PresencaDAO from "../../../db/presenca";
import { apiHandler } from "../../../utils/apis";

async function criar({req, res, db, usuario}: API) {
    const presenca: Presenca = req.body;
    console.log(presenca);
    res.send(await PresencaDAO.criar(db, usuario, presenca));
}
/*
async function listar({req, res, db, usuario} : API){
    res.send(await PresencaDAO.listar(db, usuario));
}
*/
/*
async function atualizar({req, res, db, usuario}: API) {
    const { id } = req.query;
    const presenca: Presenca = req.body;
    res.send(await PresencaDAO.atualizar(db, usuario, Number(id), presenca));
}
*/
/*
async function excluir({req, res, db, usuario}: API) {
    const { id } = req.query;
    res.send(await PresencaDAO.excluir(db, usuario, Number(id)));
}
*/

export default apiHandler({
    POST: criar,
    //GET: listar,
    //PUT: atualizar,
    //DELETE: excluir,
})
