class LogDAO {
    public static async registrar(db: PoolConnection, usuario: Usuario, acao: string, detalhes: Object){
        return db.query("INSERT INTO log (acao, detalhes, usuario) VALUES (?, ?, ?)", [
            acao,
            JSON.stringify(detalhes, null, 2),
            usuario?.nome || ""
        ])
    }

    public static async listarPorEnunciado(db: PoolConnection, enunciado: number){
        const [resposta] = await db.query(
            `SELECT *
                FROM log 
                WHERE CAST( JSON_EXTRACT(detalhes, '$.statement_id') as decimal) = ? 
                ORDER BY id DESC `, 
            [enunciado]);

        return resposta as Log[];
    }
}

export default LogDAO;