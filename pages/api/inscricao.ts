import InscricaoDAO from "../../db/inscricao";
import { apiHandler } from "../../utils/apis";

async function listar({res, db, usuario}: API){
    let inscricoes = await InscricaoDAO.listar(db, usuario);

    if(usuario.funcao === "ASSESSORIA" || usuario.funcao === "PROGRAMADOR"){
        return inscricoes;
    }

    return inscricoes.map(i => ({
        ...i,
        attendee_document: "<SIGILOSO>",
        attendee_phone: "<SIGILOSO>",
        attendee_email: "<SIGILOSO>",
    }));
}

export default apiHandler({
    "GET": listar
})