import type { PoolConnection } from 'mysql2/promise';
import PermissaoDAO from './permissao';
import LogDAO from './log';
import MembroDAO from './membro';
import ProponenteDAO from './proponente';
import createHttpError from 'http-errors';
import CalendarioDAO from './calendario';

const forumId = 1;

/*
    A jornada é compostar por 4 fases:
    1. Os usuários enviam enunciados;
    2. Os responsáveis de cada comissão analisa os enunciados, admitindo ou rejeitando eles.
    3. Cada comissão se reune e vota os enunciados que foram admitidos por aquela comissão. Cada comissão é composta por membros fixos mais todos os tiveram seus enunciados admitidos.    
    4. Todos as comissões se reunem e votam todos os enunciados que foram aprovados nas reuniões anteriores.
*/

/* 
    Esta classe representa os SQL's relacionados a Fase 3:
    1. Analisa um enunciado: Admite ou rejeita ele;
    2. Permite desfazer a análise
 */

interface RequisicaoCriacao {
    
}

class EnunciadoDAO {

    // Permite justificar um enunciado que já foi aprovado ou rejeitado.
    static async justitificar(db: PoolConnection, usuario: Usuario, statement_id: number, justificativa: string){
        // carrega as permissões do usuário logado
        const permissao = await PermissaoDAO.carregar(db, usuario);

        // carrega as informações do enunciado, que o usuário deseja alterar.
        const enunciado = await EnunciadoDAO.listarPorId(db, usuario, statement_id);

        // verifica se este enunciado pertence a um dos comites que o usuário tem permissão para alterar.
        if(permissao.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
            throw "Usuário sem permissão para analisar."
        }

        // registra quem fez a analise
        await LogDAO.registrar(db, usuario, "justificar enunciado", { statement_id, justificativa });

        // atualiza o registro.
        await db.query("UPDATE statement SET justificativa_analise = ? WHERE statement_id = ?;", [justificativa, statement_id]);
    }

    static async log(db: PoolConnection, usuario: Usuario, statement_id: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);
        
        const enunciado = await EnunciadoDAO.listarPorId(db, usuario, statement_id);

        if(!permissoes.estatistica && permissoes.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
            throw createHttpError.Forbidden("Usuário sem permissão.");
        }

        return LogDAO.listarPorEnunciado(db, statement_id);
    }

    static async criar(db: PoolConnection, statement: RequisicaoCriacao, attendeeId: number){
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

    static async analisar(db: PoolConnection, usuario: Usuario, statement_id: number, admitido: boolean, justificativa: string){
        // carrega as permissões do usuário logado
        const permissao = await PermissaoDAO.carregar(db, usuario);

        // carrega as informações do enunciado, que o usuário deseja alterar.
        const enunciado = await EnunciadoDAO.listarPorId(db, usuario, statement_id);

        // verifica se este enunciado pertence a um dos comites que o usuário tem permissão para alterar.
        if(permissao.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
            throw "Usuário sem permissão para analisar."
        }

        // registra quem fez a analise
        await LogDAO.registrar(db, usuario, "analisar enunciado", { statement_id, admitido, justificativa });

        // grava os dados no banco de dados
        if(admitido == false){
            await db.query( 
                `UPDATE statement 
                    SET admitido = ?, 
                    data_analise=now(),
                    justificativa_analise = ?
                WHERE statement_id = ?;`,
                [admitido, justificativa, statement_id]
            );
        }else{
            // Gera um ID, quando o enunciado é aprovado.
            await db.query( 
                `UPDATE 
                    statement S
                    INNER JOIN (
                        SELECT IFNULL(codigo, 0) + 1 as codigo, committee_id
                        FROM statement 
                        WHERE committee_id = ?
                        ORDER BY codigo 
                        DESC LIMIT 1	
                    ) as C on S.committee_id = C.committee_id
                SET 
                    admitido = ?,
                    S.codigo = C.codigo,
                    data_analise=now(),
                    justificativa_analise = ?
                WHERE statement_id = ?;`,
                [enunciado.committee_id, admitido, justificativa, statement_id]
            );
        }

        // Se o enunciado for aceito, o proponente é automaticamente adiciona, como membro, ao comissão que aprovou seu enunciado.
        if(admitido){
            const proponente = await ProponenteDAO.listarPorId(db, enunciado.attendee_id);
            await MembroDAO.criar(db, usuario, proponente, enunciado.committee_id);
        }
    }
    
    static async desfazerAnalise(db: PoolConnection, usuario: Usuario, statement_id: number){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        const enunciado = await EnunciadoDAO.listarPorId(db, usuario, statement_id);

        // Verifica se este enunciado pertence a uma das comissões permitidos para este usuário.
        if( permissoes.administrar_comissoes.indexOf(enunciado.committee_id) === -1)
            throw "Usuário não tem permissão";

        await LogDAO.registrar(db, usuario, "desfazer analise", { statement_id });

        await db.query( 
            `UPDATE statement 
                SET admitido = NULL, 
                codigo = null,
                justificativa_analise = NULL,
                data_analise = NULL
            WHERE statement_id = ?;`,
            [statement_id]
        );

        // Se o enunciado for aceito, o proponente é automaticamente adiciona, como membro, à comissão que aprovou seu enunciado.
        // Portanto devemos remover o membro ao desfazer a análise.
        const proponente = await ProponenteDAO.listarPorId(db, enunciado.attendee_id);
        await MembroDAO.deletar(db, usuario, proponente.attendee_name, enunciado.committee_id);        
    }

    static async listar(db: PoolConnection, usuario: Usuario){
        const { administrar_comissoes, estatistica } = await PermissaoDAO.carregar(db, usuario);
        
        const SQL_GERAL = 
            `SELECT	statement.* 
                FROM statement
                ORDER BY admitido is not null, admitido desc, data_analise desc;`;
        
        
        const SQL_ESPECIFICO = 
            `SELECT	statement.* 
                FROM statement
                WHERE committee_id in (?)
                ORDER BY admitido is not null, admitido desc, data_analise desc;`;

        const sql = estatistica ? SQL_GERAL : SQL_ESPECIFICO;
        const params = estatistica ? [] : administrar_comissoes;
        

        const [result] = await db.query( sql,params );

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

        // Verifica se este enunciado pertence a uma das comissões permitidos para este usuário.
        if(!permissoes.estatistica && permissoes.administrar_comissoes.indexOf(enunciado.committee_id) === -1)
            throw "Usuário não tem permissão";


        return enunciado;
    }

    static async listarPorVotacao(db: PoolConnection, usuario: Usuario){
        // Busca no banco a data e hora das votações.
        const calendario = await CalendarioDAO.hoje(db);
                
        const geral = calendario.find(e => e.evento === "VOTAÇÃO GERAL");
        const por_comissao = calendario.find(e => e.evento === "VOTAÇÃO POR COMISSÃO");

        // Notifica o usuário, caso haja um erro de configuração.
        if(geral && por_comissao)
            throw "Votação geral e por comissão não podem ocorrer no mesmo dia!";

        // Notifica o usuário, caso ele tente votar fora dos intervalos permitidos.
        if(!geral && !por_comissao)
            throw "Aguarde até a data da votação.";

        // Lista todos os enunciados que foram admitidos em dada comissão;
        const SQL_POR_COMISSAO = 
            `SELECT 
                statement.*, 
                votacao.inicio as votacao_inicio, 
                votacao.fim as votacao_fim
            FROM statement
            LEFT JOIN votacao on votacao.enunciado = statement_id
            WHERE 
                committee_id = ? AND admitido = 1;`

        // Seleciona todos os enunciados que foram aprovados ( mais votos positivos do que negativos)
        const SQL_GERAL =
            `SELECT statement.*
                FROM 
                    statement
                INNER JOIN (    
                    SELECT 
                        votacao.enunciado,
                        sum(IF(voto.voto = 1, 1, 0)) as favor,
                        sum(IF(voto.voto = 1, 0, 1)) as contra
                    FROM votacao
                    LEFT JOIN voto on votacao.id = voto.votacao
                    GROUP BY votacao.enunciado
                    HAVING favor > contra
                ) V on V.enunciado = statement_id`;

        const SQL = por_comissao ? SQL_POR_COMISSAO : SQL_GERAL;
        const params = por_comissao ? usuario.permissoes.administrar_comissoes : [];

        const [enunciados] = await db.query( SQL, params);

        return enunciados;
    }

    static async alterarComite(db: PoolConnection, usuario: Usuario, statement_id: number, committee_id: number){
        const permissao = await PermissaoDAO.carregar(db, usuario);

        const enunciado = await EnunciadoDAO.listarPorId(db, usuario, statement_id);

        if(permissao.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
            throw "Usuário sem permissão";
        }

        await LogDAO.registrar(db, usuario, "alterar comissão", { statement_id, committee_id, comite_antigo: enunciado.committee_id });

        await db.query( 
            `UPDATE statement SET committee_id = ? WHERE statement_id = ?`,
            [committee_id, statement_id]
        );
    }
}

export default EnunciadoDAO;