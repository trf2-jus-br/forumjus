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
        const permissao = await PermissaoDAO.carregar(db, usuario);

        const [result] = await db.query( 
            `select committee.*, count(*) as enunciados
            from committee
            inner join statement on committee.committee_id = statement.committee_id
            where committee.committee_id in (?)
            group by committee_id
            `, [permissao.administrar_comissoes]);

        return result as ComiteDetalhado[];
    }

}

export default ComiteDAO;