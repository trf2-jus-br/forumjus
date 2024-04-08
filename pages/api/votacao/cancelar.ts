import { apiHandler } from "../../../utils/apis";

async function cancelarVotacao({db, usuario, req} : API){
    if(usuario.funcao !== "PRESIDENTE" && usuario.funcao !== "PRESIDENTA")
        throw "Usuário sem premisão"

    const { id } = req.query;

    if( id == null)
        throw "id nulo";

    await db.query('DELETE FROM voto WHERE votacao = ?;', [id]);
    await db.query('DELETE FROM votacao WHERE id = ?;', [id]);
}

export default apiHandler({
    DELETE: cancelarVotacao
})