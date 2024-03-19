class PresencaDAO {
    static async marcarEntrada(db: PoolConnection, usuario: Usuario, presenca: Presenca){
        let query = 'INSERT INTO presenca (membro, dia) VALUES (?, ?);';
        await db.query(query, [presenca.membroId, presenca.dia]);
    }

    static async marcarSaida(db: PoolConnection, usuario: Usuario, presenca: Presenca){
        let query = 'UPDATE presenca SET saida = NOW() WHERE membro = ? AND dia = ?;';
        await db.query(query, [presenca.membroId, presenca.dia]);
    }

    static async listarMembrosPresentes(db: PoolConnection, usuario: Usuario){
        let query = `
            SELECT 
                m.nome, 
                m.funcao, 
                DATE_FORMAT(p.entrada, '%d/%m/%Y %H:%i:%s') as entrada,
                DATE_FORMAT(p.saida, '%d/%m/%Y %H:%i:%s') as saida
            FROM 
                presenca p 
            INNER JOIN 
                membro m ON p.membro = m.id    
        `;
        const [result] = await db.query(query);
        return result as Presenca[];
    }
}

export default PresencaDAO;
