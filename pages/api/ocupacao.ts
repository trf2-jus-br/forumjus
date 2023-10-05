import OcupacaoDAO from "../../db/ocupacao";
import { apiHandler } from "../../utils/apis";

async function listar({db, res} : API){
    res.send(
        await OcupacaoDAO.listar(db)
    );
}

export default apiHandler({
    "GET": listar
})