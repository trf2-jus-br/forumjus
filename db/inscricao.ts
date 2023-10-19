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
        const { estatistica, administrar_comissoes } = await PermissaoDAO.carregar(db, usuario);

        const sql = estatistica ? SQL_GERAL : SQL_ESPECIFICO;
        const params = estatistica ? [] : administrar_comissoes

        // executa o SQL adequado.
        const [inscricoes] = await db.query( sql, params );

        return inscricoes as Inscricao[];
    }
}

export default InscricaoDAO;