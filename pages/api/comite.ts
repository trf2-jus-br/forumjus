//"use server"

import { apiHandler } from "../../utils/apis";
import ComiteDAO from "../../db/comite";


async function listar({req, res, db, usuario}: API){
    const {detalhes} = req.query;

    const comites = detalhes ? await ComiteDAO.detalharPorUsuario(db, usuario) : await ComiteDAO.listar(db);
    res.send(comites);
}

export default apiHandler({
    "GET": listar
})