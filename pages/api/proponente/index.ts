import ProponenteDAO from "../../../db/proponente";
import { apiHandler } from "../../../utils/apis";

async function listar({res, db, usuario} : API){
    
    res.send(
        await ProponenteDAO.listar(db, usuario)
    );
}


export default apiHandler({
    "GET": listar
})