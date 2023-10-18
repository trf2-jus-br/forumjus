class LogDAO {
    public static async registrar(db: PoolConnection, usuario: Usuario, acao: string, detalhes: Object){
        return db.query("INSERT INTO log (acao, detalhes, usuario) VALUES (?, ?, ?)", [
            acao,
            JSON.stringify(detalhes, null, 2),
            usuario?.nome || ""
        ])
    }
}

export default LogDAO;