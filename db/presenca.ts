//import PermissaoDAO from "./permissao";
//import LogDAO from "./log";

class PresencaDAO {
    static async criar(db: PoolConnection, usuario: Usuario, presenca: Presenca){
        let query = 'INSERT INTO presenca (membro, dia) VALUES (?, ?);';
        await db.query(query, [presenca.membroId, presenca.dia]);
    }

    static async atualizar(db: PoolConnection, usuario: Usuario, presenca: Presenca){
        let query = 'UPDATE presenca SET saida = NOW() WHERE membro = ? AND dia = ?;';
        await db.query(query, [presenca.membroId, presenca.dia]);
    }    
    /*
    static async listar(db: PoolConnection, usuario: Usuario){
        const permissoes = await PermissaoDAO.carregar(db, usuario);
        const sql = 'SELECT * FROM presenca;';
        const [result] = await db.query(sql);
        return result as Presenca[];
    }

    static async excluir(db: PoolConnection, usuario: Usuario, id: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);
        await db.query('DELETE FROM presenca WHERE id = ?;', [id]);
    }
    */
}

export default PresencaDAO;