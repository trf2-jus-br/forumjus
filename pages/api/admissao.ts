import { apiHandler } from "../../utils/apis";
import EnunciadoDAO from "../../db/enunciado";

async function listar({req, res, db, usuario}: API){
    res.send(
        await EnunciadoDAO.listar(db, usuario)
    )
}

async function analisar({req, res, db, usuario}: API){
    const { statement_id, admitido } = req.body;

    res.send(
        await EnunciadoDAO.analisar(db, usuario, statement_id, admitido)
    )
}

async function desfazer({req, res, db, usuario}: API){
    let statement_id : number = req.query.statement_id;

    res.send(
        await EnunciadoDAO.desfazerAnalise(db, usuario, statement_id)
    );
}

export default apiHandler({
    "GET" : listar,
    "POST": analisar,
    "DELETE": desfazer,
}) 