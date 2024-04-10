import { apiHandler, apiPermitidaAo } from "../../../utils/apis";

async function editarRedacao({db, usuario, req} : API){
    apiPermitidaAo(usuario, 'PRESIDENTA', 'PRESIDENTE', 'RELATOR', 'RELATORA');

    const {id, justificativa, texto} = req.body;

    const SQL ='UPDATE statement SET statement_text = ?, statement_justification = ? WHERE statement_id = ?;'

    await db.query(SQL, [texto, justificativa, id]);
}

export default apiHandler({
    PUT: editarRedacao
})