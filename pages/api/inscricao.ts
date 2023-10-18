import InscricaoDAO from "../../db/inscricao";
import { apiHandler } from "../../utils/apis";

async function listar({res, db, usuario}: API){
    res.send(
        await InscricaoDAO.listar(db, usuario)
    )
}

export default apiHandler({
    "GET": listar
})