
class OcupacaoDAO {

    static async listar(db: PoolConnection){
        const result = await db.query('SELECT * FROM occupation;')
        return result[0] as Ocupacao[];
    }
}

export default OcupacaoDAO;