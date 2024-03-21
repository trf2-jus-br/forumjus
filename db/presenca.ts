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
                p.membro,
                DATE_FORMAT(p.entrada, '%d/%m/%Y %H:%i:%s') as entrada,
                DATE_FORMAT(p.saida, '%d/%m/%Y %H:%i:%s') as saida
            FROM 
                presenca p 
            INNER JOIN 
                membro m ON p.membro = m.id
            WHERE 
                p.saida IS NULL    
        `;
        const [result] = await db.query(query);
        return result as Presenca[];
    }

    static async listarMembrosPresentesPorComite(db: PoolConnection, usuario: Usuario, comite: number){
        let query = `
            SELECT 
                m.nome, 
                m.funcao,
                m.comite, 
                p.membro,
                DATE_FORMAT(p.entrada, '%d/%m/%Y %H:%i:%s') as entrada,
                DATE_FORMAT(p.saida, '%d/%m/%Y %H:%i:%s') as saida
            FROM 
                presenca p 
            INNER JOIN 
                membro m ON p.membro = m.id    
            WHERE 
                m.comite = ? AND p.saida IS NULL
            ORDER BY 
                p.entrada ASC;
        `;
        const [result] = await db.query(query, [comite]);
        return result as Presenca[];
    }
    
    static async marcarEntradaComToken(db: PoolConnection, usuario: Usuario, token: string) {
        try {
            let queryMembro = 'SELECT id FROM membro WHERE token = ?;';
            const [membros] = await db.query(queryMembro, [token]);
            console.log(token)
            if (membros.length === 0) {
                throw new Error('Membro não encontrado com o token fornecido.');
            }
    
            const membroId = membros[0].id;
    
            let queryPresenca = 'INSERT INTO presenca (membro) VALUES (?);';
            await db.query(queryPresenca, [membroId]);
    
            return { success: true, membroId: membroId };
        } catch (error) {
            console.error('Erro ao marcar entrada com token:', error);
            throw new Error('Erro ao registrar a presença: ' + error.message);
        }
    }
    

}

export default PresencaDAO;
