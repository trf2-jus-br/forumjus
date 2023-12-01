type ComiteDetalhado = Comite & {
    enunciados: number;
}

class ComiteDAO {

    static async listar(db: PoolConnection){
        const [result] = await db.query( `select * from committee`);
        return result as Comite[];
    }

    static async detalhar(db: PoolConnection){
        const SQL = 
            `SELECT committee.*, count(statement_id) as enunciados
            FROM committee
            LEFT JOIN statement on committee.committee_id = statement.committee_id
            GROUP BY committee_id`;

        
        const [result] = await db.query( SQL);
        return result as ComiteDetalhado[];
    }
}

export default ComiteDAO;