class ForumDAO {
    static async ultimo(db: PoolConnection){
        const [result] = await db.query( 'SELECT * FROM forum ORDER BY forum_id DESC LIMIT 1;');
        return result[0] as Forum; 
    }

    static async listar(db: PoolConnection){
        
    }
}

export default ForumDAO;