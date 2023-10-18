import MembroDAO from "../../db/membro";
import { apiHandler } from "../../utils/apis";

async function listar({res, db, usuario} : API){
    res.send(
        await MembroDAO.listar(db, usuario)
    );
}

export default apiHandler({
    GET: listar
})