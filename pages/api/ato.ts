import CadernoDAO from "../../db/caderno";
import VotacaoDAO from "../../db/votacao";
import { apiHandler, apiPermitidaAo } from "../../utils/apis";

async function listar({db, usuario} : API){
    apiPermitidaAo(usuario, "ASSESSORIA", "PROGRAMADOR");

    return await CadernoDAO.cadernoPrelinar(db, usuario, 1);
}

export default apiHandler({
    "GET": listar
})