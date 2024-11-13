import ProponenteDAO from "../../../db/proponente";
import { apiHandler } from "../../../utils/apis";

async function notificar({res, req, db, usuario} : API){
    const {cadernos} = req.body;

    return await ProponenteDAO.notificar(db, usuario, cadernos)
}

export default apiHandler({
    "POST": notificar
})