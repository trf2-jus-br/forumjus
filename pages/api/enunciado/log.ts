import EnunciadoDAO from "../../../db/enunciado";
import { apiHandler } from "../../../utils/apis";

async function log({db, usuario, req, res} : API){
    const {id} = req.query;

    res.send(
        await EnunciadoDAO.log(db, usuario, id)
    )
}

export default apiHandler({
    "GET": log
})