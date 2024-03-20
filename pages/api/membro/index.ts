import MembroDAO from "../../../db/membro";
import { apiHandler } from "../../../utils/apis";

async function listar({req, res, db, usuario} : API){
    let comite = req.query.comissaoId[0];
    res.send(
        await MembroDAO.listar(db, usuario, comite)
    );
}

export default apiHandler({
    GET: listar
})