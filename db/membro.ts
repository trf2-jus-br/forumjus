import createHttpError from "http-errors";
import PermissaoDAO from "./permissao";
import LogDAO from "./log";

class MembroDAO {

    static async criar(db: PoolConnection, usuario: Usuario, proponente: Proponente, comite: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        if(permissoes.administrar_comissoes.indexOf(comite) === -1)
            throw createHttpError.Forbidden("Usuário sem permissão para criar Membro.");
        
        const [membros] = await db.query('SELECT * FROM membro WHERE proponente = ? and comite = ?;', [proponente.attendee_id, comite]);

        if(membros.length !== 0)
            throw createHttpError.BadRequest("O Membro já está cadastrado!");


        await LogDAO.registrar(db, usuario, "criação do membro", {proponente, comite});

        await db.query("INSERT INTO membro (nome, proponente, funcao, comite, token) VALUES (?, ?, 'MEMBRO', ?, uuid());", [proponente.attendee_name, proponente.attendee_id, comite]);
    }

    static async deletar(db: PoolConnection, usuario: Usuario, nome: string, comite: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        if(permissoes.administrar_comissoes.indexOf(comite) === -1)
            throw createHttpError.Forbidden("Usuário sem permissão para criar Membro.");
        
        const [membros] = await db.query('SELECT * FROM membro WHERE nome = ? and comite = ?;', [nome, comite]);

        if(membros.length !== 0){
            await LogDAO.registrar(db, usuario, "remoção do membro", {membros});
            await db.query("DELETE FROM membro WHERE nome = ? and comite = ?;", [nome, comite]);
        }
    }

    static async listar(db: PoolConnection, usuario: Usuario){
        const SQL_GERAL = 'SELECT * FROM membro;';
        const SQL_ESPECIFICO = 'SELECT * FROM membro WHERE comite = ?;';

        const {estatistica, administrar_comissoes} = usuario.permissoes;

        const sql = estatistica ? SQL_GERAL : SQL_ESPECIFICO;
        const params = estatistica ? [] : administrar_comissoes;

        const [result] = await db.query(sql, params);
        
        return result as Membro[];
    }
}

export default MembroDAO;