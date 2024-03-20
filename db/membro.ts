import createHttpError from "http-errors";
import PermissaoDAO from "./permissao";
import LogDAO from "./log";

class MembroDAO {

    static async criar(db: PoolConnection, usuario: Usuario, proponente: Proponente, comite: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        if(permissoes.administrar_comissoes.indexOf(comite) === -1)
            throw createHttpError.Forbidden("Usuário sem permissão para criar Membro.");
        
        const [membros] = await db.query('SELECT * FROM membro WHERE proponente = ? and comite = ?;', [proponente.attendee_id, comite]);

        // Caso o usuário já exista, apenas registra um log da solicitação.
        if(membros.length !== 0)
            return await LogDAO.registrar(db, usuario, "criação do membro (duplicado)", {proponente, comite});

        await LogDAO.registrar(db, usuario, "criação do membro", {proponente, comite});

        await db.query("INSERT INTO membro (nome, proponente, funcao, comite, token) VALUES (?, ?, 'MEMBRO', ?, uuid());", [proponente.attendee_name, proponente.attendee_id, comite]);
    }

    static async deletar(db: PoolConnection, usuario: Usuario, proponente: number, comite: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        if(permissoes.administrar_comissoes.indexOf(comite) === -1)
            throw createHttpError.Forbidden("Usuário sem permissão para criar Membro.");
        
        await LogDAO.registrar(db, usuario, "remoção do membro", {proponente, comite});
        await db.query("DELETE FROM membro WHERE proponente = ? and comite = ?;", [proponente, comite]);
    }

    static async listar(db: PoolConnection, usuario: Usuario, comite: string){
        const SQL_ESPECIFICO = 'SELECT * FROM membro WHERE comite = ?;';
        const SQL_GERAL = 'SELECT * FROM membro;';
        
        if (comite != "0" && comite != null) {
            const [result] = await db.query(SQL_ESPECIFICO, [comite]);
            return result as Membro[];
        } else {
            const [result] = await db.query(SQL_GERAL);
            return result as Membro[];
        }
    }
    
    static async listarTodos(db: PoolConnection, usuario: Usuario){
        const SQL_GERAL = 'SELECT * FROM membro;';
        //const SQL_ESPECIFICO = 'SELECT * FROM membro WHERE comite = ?;';
        const SQL_ESPECIFICO = 'SELECT * FROM membro ;';

        const {estatistica, administrar_comissoes} = await PermissaoDAO.carregar(db, usuario);
        const sql = estatistica ? SQL_GERAL : SQL_ESPECIFICO;
        const params = estatistica ? [] : administrar_comissoes;
        const [result] = await db.query(sql, params);

        return result as Membro[];
    }
}

export default MembroDAO;