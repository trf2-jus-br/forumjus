"use server"

import { apiHandler } from "../../utils/apis";
import ComiteDAO from "../../db/comite";


async function listar({res, db, usuario}: API){
    const comites = usuario ? await ComiteDAO.detalharPorUsuario(db, usuario) : await ComiteDAO.listar(db);
    res.send(comites);
}

export default apiHandler({
    "GET": listar
})