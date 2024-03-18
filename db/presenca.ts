//import PermissaoDAO from "./permissao";
//import LogDAO from "./log";

class PresencaDAO {
    static async criar(db: PoolConnection, usuario: Usuario, presenca: Presenca){
        //const permissoes = await PermissaoDAO.carregar(db, usuario);
        let query = 'INSERT INTO presenca (membro, dia) VALUES (' + presenca.membroId + ', "' + presenca.dia + '");';
        await db.query(query);
    }

    /*
    static async listar(db: PoolConnection, usuario: Usuario){
        const permissoes = await PermissaoDAO.carregar(db, usuario);
        const sql = 'SELECT * FROM presenca;';
        const [result] = await db.query(sql);
        return result as Presenca[];
    }
    
    static async atualizar(db: PoolConnection, usuario: Usuario, id: number, presenca: Presenca){
        const permissoes = await PermissaoDAO.carregar(db, usuario);
        const { membro, entrada, saida, dia } = presenca;
        await db.query('UPDATE presenca SET membro = ?, entrada = ?, saida = ?, dia = ? WHERE id = ?;', [membro, entrada, saida, dia, id]);
    }
    
    static async excluir(db: PoolConnection, usuario: Usuario, id: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);
        await db.query('DELETE FROM presenca WHERE id = ?;', [id]);
    }
    */
}

export default PresencaDAO;