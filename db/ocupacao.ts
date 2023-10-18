
const forumId = 1;

class OcupacaoDAO {

    static async listar(db: PoolConnection){
        const result = await db.query('SELECT * FROM occupation WHERE forum_id = ?;', [forumId])
        return result[0] as Ocupacao[];
    }
}

export default OcupacaoDAO;