//import MembroDAO from "../../../db/membro";
import { apiHandler } from "../../../utils/apis";

async function cadastrarPresenca(){
    console.log("api cadastrar presenca");
}

/*
async function cadastrarPresenca({req, res, db, usuario} : API){
    const {membroId} = req.body;
    res.send(
        await MembroDAO.cadastrarPresenca(db, usuario, membroId)
    );

}
*/

export default apiHandler({
    //GET: listar,
    POST: cadastrarPresenca
})
