import PermissaoDAO from "./permissao";

type ComiteDetalhado = Comite & {
    enunciados: number;
}

class ComiteDAO {

    static async listar(db: PoolConnection){
        const [result] = await db.query( `select * from committee`);
        return result as Comite[];
    }

    static async detalharPorUsuario(db: PoolConnection, usuario: Usuario){
        const { administrar_comissoes, estatistica } = usuario.permissoes;

        const SQL_GERAL = 
            `SELECT committee.*, count(statement_id) as enunciados
            FROM committee
            LEFT JOIN statement on committee.committee_id = statement.committee_id
            GROUP BY committee_id`;

        const SQL_ESPECIFICO = 
            `SELECT committee.*, count(statement_id) as enunciados
                FROM committee
                LEFT JOIN statement on committee.committee_id = statement.committee_id
                WHERE committee.committee_id in (?)
                GROUP BY committee_id`;

        const sql = estatistica ? SQL_GERAL : SQL_ESPECIFICO;
        const params = estatistica ? [] : administrar_comissoes;

        const [result] = await db.query( sql, params);

        return result as ComiteDetalhado[];
    }

}

export default ComiteDAO;