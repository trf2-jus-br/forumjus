import type { PoolConnection } from 'mysql2/promise';
import PermissaoDAO from './permissao';

const forumId = 1;

/*
    A jornada é compostar por 4 fases:
    1. Os usuários enviam enunciados;
    2. Os responsáveis de cada comitê analisa os enunciados, admitindo ou rejeitando eles.
    3. Cada comitê se reune e vota os enunciados que foram admitidos por aquele comitê. Cada comitê é composto por membros fixos mais todos os tiveram seus enunciados admitidos.    
    4. Todos os comitês se reunem e votam todos os enunciados que foram aprovados nas reuniões anteriores.
*/

/* 
    Esta classe representa os SQL's relacionados a Fase 3:
    1. Analisa um enunciado: Admite ou rejeita ele;
    2. Permite desfazer a análise
 */

interface RequisicaoCriacao {
    
}

class EnunciadoDAO {

    static async criar(db: PoolConnection, statement: RequisicaoCriacao, attendeeId: number){
        console.log("CRIAR");
        
        return db.query(
            `INSERT INTO statement (
                forum_id,attendee_id,committee_id,
                statement_text,statement_justification
            ) 
            VALUES (
                ?,?,?,
                ?,?
            );`,
            [
                forumId, attendeeId, parseInt(statement.committeeId), 
                statement.text, statement.justification
            ]
        );
    }

    static async analisar(db: PoolConnection, usuario: Usuario, statement_id: number, admitido: boolean){
        // carrega as permissões do usuário logado
        const permissao = await PermissaoDAO.carregar(db, usuario);

        // carrega as informações do enunciado, que o usuário deseja alterar.
        const enunciado = await EnunciadoDAO.listarPorId(db, usuario, statement_id);

        // verifica se este enunciado pertence a um dos comites que o usuário tem permissão para alterar.
        if(permissao.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
            throw "Usuário sem permissão para analisar."
        }

        const nome = `${usuario.nome} (${usuario.matricula})`;

        const [result] = await db.query( 
            `UPDATE statement 
                SET admitido = ?, 
                analisado_por = ?, 
                data_analise=now() 
            WHERE statement_id = ?;`,
            [admitido, nome, statement_id]
        );

        return result;
    }
    
    static async desfazerAnalise(db: PoolConnection, usuario: Usuario, statement_id: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        const enunciado = await EnunciadoDAO.listarPorId(db, usuario, statement_id);

        // Verifica se este enunciado pertence a um dos comitês permitidos para este usuário.
        if( permissoes.administrar_comissoes.indexOf(enunciado.committee_id) === -1)
            throw "Usuário não tem permissão";

        await db.query( 
            `UPDATE statement 
                SET admitido = NULL, 
                analisado_por = NULL, 
                data_analise = NULL 
            WHERE statement_id = ?;`,
            [statement_id]
        );
    }

    static async listar(db: PoolConnection, usuario: Usuario){
        const permissoes = await PermissaoDAO.carregar(db, usuario);
        
        if( permissoes.administrar_comissoes.length === 0)
            throw "Usuário não tem permissão";

        const [result] = await db.query( 
            `SELECT	statement.* 
            FROM statement
            WHERE committee_id in (?)
            ORDER BY admitido is not null, admitido desc, data_analise desc;`
        , 
        [permissoes.administrar_comissoes]);

        return result as Enunciado[];
    }

    static async listarPorId(db: PoolConnection, usuario: Usuario, statement_id: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);
        
        const result = await db.query( 
            `SELECT	statement.* 
            FROM statement
            WHERE statement_id = ?;`
        , 
        [statement_id]);

        const enunciado = result[0][0] as Enunciado;

        // Verifica se este enunciado pertence a um dos comitês permitidos para este usuário.
        if( permissoes.administrar_comissoes.indexOf(enunciado.committee_id) === -1)
            throw "Usuário não tem permissão";


        return enunciado;
    }

    static async alterarComite(db: PoolConnection, usuario: Usuario, statement_id: number, committee_id: number){
        const permissao = await PermissaoDAO.carregar(db, usuario);

        const enunciado = await EnunciadoDAO.listarPorId(db, usuario, statement_id);

        if(permissao.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
            throw "Usuário sem permissão";
        }

        await db.query( 
            `UPDATE statement SET committee_id = ? WHERE statement_id = ?`,
            [committee_id, statement_id]
        );
    }
}

export default EnunciadoDAO;