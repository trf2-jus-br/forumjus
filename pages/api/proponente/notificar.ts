import ProponenteDAO from "../../../db/proponente";
import { apiHandler } from "../../../utils/apis";

async function notificar({res, db, usuario} : API){
    res.send(
        await ProponenteDAO.notificar(db, usuario)
    );
}

export default apiHandler({
    "POST": notificar
})