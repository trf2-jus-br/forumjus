import createHttpError from "http-errors";
import PermissaoDAO from "./permissao";

/*
    Classe agrupa as informação da inscrição: Enunciados, Proponente.
*/
class InscricaoDAO {
    static async listar(db: PoolConnection, usuario: Usuario){
        // usuários com a permissão 'estatística' podem listar todos os enunciados.
        const SQL_GERAL = 
            `SELECT * 
                FROM statement 
                JOIN attendee 
                    ON statement.attendee_id = attendee.attendee_id;`;

        // relatores / presidentes veem apenas os enunciados das suas comissões.
        const SQL_ESPECIFICO = 
            `SELECT * 
                FROM statement 
                JOIN attendee 
                    ON statement.attendee_id = attendee.attendee_id
                WHERE statement.committee_id = ?;`;
        
        // analisa as permissões do usuário.
        const { votar_comissoes } = await PermissaoDAO.carregar(db, usuario);

        // analisa as permissões do usuário.
        const eh_geral = usuario.funcao === "PROGRAMADOR" || usuario.funcao === "ASSESSORIA";
        const sql = eh_geral ? SQL_GERAL : SQL_ESPECIFICO;
        const params = eh_geral ? [] : votar_comissoes

        // executa o SQL adequado.
        const [inscricoes] = await db.query( sql, params );

        return inscricoes as Inscricao[];
    }
}

export default InscricaoDAO;