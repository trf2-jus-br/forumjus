import CalendarioDAO from "../../db/calendario";
import { apiHandler } from "../../utils/apis";

async function listar({db} : API){
    return CalendarioDAO.listar(db);
}

export default apiHandler({
    GET: listar
})