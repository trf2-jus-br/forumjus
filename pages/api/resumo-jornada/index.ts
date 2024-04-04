import CalendarioDAO from "../../../db/calendario";
import ComiteDAO from "../../../db/comite";
import MembroDAO from "../../../db/membro";
import { apiHandler } from "../../../utils/apis";


async function resumo({db, usuario} : API){
    const calendario = await CalendarioDAO.hoje(db);
    const votacao_geral = calendario.find(c => c.evento === "VOTAÇÃO GERAL");

    const comite_permitido = usuario.permissoes.votar_comissoes[0];
    const membros = await MembroDAO.listar(db, usuario);
    const comites = await ComiteDAO.detalhar(db);

    const SQL_POR_COMISSAO = 
        `SELECT statement_text, quorum, favor FROM statement 
        JOIN votacao_detalhada ON enunciado = statement_id
        WHERE statement.committee_id = ? AND evento = 'VOTAÇÃO POR COMISSÃO';`

    const SQL_GERAL = 
        `SELECT statement_text, quorum, favor FROM statement 
        JOIN votacao_detalhada ON enunciado = statement_id
        WHERE statement.committee_id = ? AND evento = 'VOTAÇÃO POR COMISSÃO';`

    const SQL = votacao_geral ? SQL_GERAL : SQL_POR_COMISSAO;
    const PARAMS = votacao_geral ? [] : [comite_permitido]; 

    const [enunciados] = await db.query(SQL, PARAMS);

    return {
        comites: votacao_geral ? comites : comites.filter(c => c.committee_id == comite_permitido),
        membros: votacao_geral ? membros : membros.filter(m => m.comite == comite_permitido),
        enunciados
    }
}


export default apiHandler({
    GET: resumo
})