import createHttpError from "http-errors";
import PermissaoDAO from "./permissao";
import CalendarioDAO from "./calendario";
import { EstadoVotacao, EstadoJornada } from "../utils/enums";
import PresencaDAO from "./presenca";

class VotacaoDAO {

    private static async bemVindo(db: PoolConnection, votacao_geral: boolean, comite: number){
        const SQL_GERAL = `SELECT COUNT(*) qnt FROM votacao_detalhada_2 WHERE evento = 'VOTAÇÃO GERAL';`
        const SQL_POR_COMISSAO = `SELECT COUNT(*) qnt FROM votacao_detalhada_2 WHERE evento = 'VOTAÇÃO POR COMISSÃO' AND committee_id = ?;`

        const SQL_BEM_VINDO = votacao_geral ? SQL_GERAL : SQL_POR_COMISSAO;
        const PARAMS = votacao_geral ? [] : [comite];

        const [resultado] = await db.query(SQL_BEM_VINDO, PARAMS);

        return resultado[0].qnt === 0;
    }
    
    private static async encerrado(db: PoolConnection, votacao_geral: boolean, comite: number){
        const SQL_GERAL = 
            `SELECT 
                COUNT(*) qnt 
            FROM 
                votacao_detalhada_2 
            WHERE 
                evento = 'VOTAÇÃO POR COMISSÃO' AND 
                aprovado AND
                enunciado NOT IN (
                    SELECT enunciado FROM votacao_detalhada_2 WHERE evento = 'VOTAÇÃO GERAL' AND fim IS NOT NULL
                );`

        const SQL_POR_COMISSAO = 
            `SELECT 
                COUNT(*) qnt 
            FROM 
                statement 
            WHERE 
                admitido = 1 AND 
                committee_id = ? AND 
                statement_id NOT IN (
                    SELECT enunciado FROM votacao WHERE fim IS NOT NULL
                );`

        const SQL_BEM_VINDO = votacao_geral ? SQL_GERAL : SQL_POR_COMISSAO;
        const PARAMS = votacao_geral ? [] : [comite];

        const [resultado] = await db.query(SQL_BEM_VINDO, PARAMS);

        return resultado[0].qnt === 0;
    }
    

    private static async estadoJornada(db: PoolConnection, votacao_geral: boolean, comite: number) : Promise<EstadoJornada>{
        if(await VotacaoDAO.bemVindo(db, votacao_geral, comite))
            return EstadoJornada.BEM_VINDO;

        
        if(await VotacaoDAO.encerrado(db, votacao_geral, comite)){
            return EstadoJornada.ENCERRAMENTO
        }
         
        return EstadoJornada.VOTACAO;
    }

    // função chamada pelas telas '/votacao' e '/telao'.
    // traz as  informações do enunciado que está sendo votado.
    static async listar(db: PoolConnection, usuario: Usuario){
        const calendario = await CalendarioDAO.hoje(db);
        const votacao_geral = calendario.find(c => c.evento === "VOTAÇÃO GERAL");

        const comissao = usuario.permissoes.votar_comissoes[0];

        const SQL_ENUNCIADO_POR_COMISSAO = 
            `SELECT 
                aprovado,
                votacao.id as votacao,
                statement_text as texto,
                statement_justification as justificativa,
                committee_name as comissao,
                votacao.cronometro - timestampdiff(second, votacao.alterado, now()) as inicio_defesa,
                votacao.cronometro,
                votacao.status,
                votacao.quorum
            FROM votacao_detalhada_2 as votacao
                LEFT JOIN statement on statement_id = votacao.enunciado
                LEFT JOIN committee on statement.committee_id = committee.committee_id
            WHERE 
                statement.committee_id = ?
            ORDER BY id DESC 
            LIMIT 1;`

        const SQL_ENUNCIADO_GERAL = 
            `SELECT 
                aprovado,
                votacao.id as votacao,
                statement_text as texto,
                statement_justification as justificativa,
                committee_name as comissao,
                votacao.cronometro - timestampdiff(second, votacao.alterado, now()) as inicio_defesa,
                votacao.cronometro,
                votacao.status,
                votacao.quorum
            FROM votacao_detalhada_2 as votacao
                LEFT JOIN statement on statement_id = votacao.enunciado
                LEFT JOIN committee on statement.committee_id = committee.committee_id
            WHERE evento = 'VOTAÇÃO GERAL'
            ORDER BY id DESC 
            LIMIT 1;`;
        
        const SQL_ENUNCIADO = votacao_geral ? SQL_ENUNCIADO_GERAL : SQL_ENUNCIADO_POR_COMISSAO;
        const params_enunciados = votacao_geral ? [] : [comissao];

        const [enunciados] = await db.query(SQL_ENUNCIADO, params_enunciados);

        if(enunciados.length === 0)
            return null;
        
        const SQL_VOTO_GERAL = 
            `SELECT 
                membro.id,
                membro.nome,
                CAST(V.voto as SIGNED) voto
            FROM membro
            LEFT JOIN (
                SELECT * FROM voto where votacao = ?
            ) V on V.membro = membro.id
            ORDER BY V.data DESC;`

        const SQL_VOTO_POR_COMISSAO = 
            `SELECT 
                membro.id,
                membro.nome,
                CAST(V.voto as SIGNED) voto
            FROM membro
            LEFT JOIN (
                SELECT * FROM voto where votacao = ?
            ) V on V.membro = membro.id
            WHERE comite = ?
            ORDER BY V.data DESC;`


        const SQL_VOTO = votacao_geral ? SQL_VOTO_GERAL : SQL_VOTO_POR_COMISSAO;
        const params_votos = votacao_geral ? [enunciados[0].votacao, comissao] : [enunciados[0].votacao,comissao,comissao];

        const [votos] = await db.query(SQL_VOTO, params_votos);

        // Define qual tela deve ser apresentada: Bem-Vindo, Encerramento ou Votação.
        const estadoJornada = await VotacaoDAO.estadoJornada(db, votacao_geral != null, comissao);
            
        // informa se o usuário registrou a presença
        const presencaRegistrada = await PresencaDAO.usuarioPresente(db, enunciados[0].votacao, usuario);

        return {
            presencaRegistrada,
            aprovado: enunciados[0].aprovado,
            quorum: enunciados[0].quorum,
            votacao: enunciados[0].votacao,
            cronometro: enunciados[0].cronometro,
            estadoJornada,
            estadoVotacao: enunciados[0].status,
            texto: enunciados[0].texto,
            justificativa: enunciados[0].justificativa,
            comissao: enunciados[0].comissao,
            inicio_defesa: enunciados[0].inicio_defesa,
            votos : votos
        }
    }

    static async existeVotacaoEmAndamento(db: PoolConnection, enunciado: number){
        const [votacao] = await db.query('SELECT * FROM votacao WHERE enunciado = ? AND fim IS NULL;', [enunciado]);

        return votacao[0] != undefined;
    }

    static async votar(db: PoolConnection, usuario: Usuario, votacao: number, favoravel: boolean){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        // Não verifico se o usuário pode votar na comissão específica.
        // Até porque no 2º dia, todos votam em todas as comissões.
        if(permissoes.votar_comissoes.length === 0)
            throw "Usuário sem Permissão para votar";

        await db.query(`INSERT INTO voto (votacao, membro, voto) VALUES (?, ?, ?)`, [votacao, usuario.id, favoravel]);
    }

    static async alterar(db: PoolConnection, enunciado: number, estadoVotacao: EstadoVotacao, cronometro: number | null){
        const SQL = `UPDATE votacao SET status = ?, alterado = now(), cronometro = ? WHERE enunciado = ? ORDER BY id DESC LIMIT 1;`
        await db.query(SQL, [estadoVotacao, cronometro, enunciado]);  
    }

    static async criar(db: PoolConnection, usuario: Usuario, id_enunciado: number){
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

        // Antes de iniciar um enunciado, verifica se há algum outro em votação.
        const SQL_VOTACAO_ANDAMENTO_POR_COMISSAO = `
            SELECT 
                votacao.*,
                statement.committee_id
            FROM votacao 
            INNER JOIN statement ON statement_id = enunciado
            WHERE 
                committee_id = (
                    SELECT committee_id FROM statement WHERE statement_id = ?
                ) AND 
                fim IS NULL;`

        const SQL_VOTACAO_ANDAMENTO_GERAL = 'SELECT * FROM votacao WHERE fim IS NULL;'
         

        const SQL_VOTACAO_ANDAMENTO = por_comissao ? SQL_VOTACAO_ANDAMENTO_POR_COMISSAO : SQL_VOTACAO_ANDAMENTO_GERAL;
        const params = por_comissao ? [id_enunciado] : []

        const [votacao_andamento] = await db.query(SQL_VOTACAO_ANDAMENTO, params) as any[]

        // Notifica o usuário caso haja outra votação em andamento.
        if(votacao_andamento.length !== 0)
            throw createHttpError.BadRequest("Já há uma votação em andamento.");


        // Caso esteja tudo certo, inicia a votação.
        const SQL = `INSERT INTO votacao(enunciado, iniciada_por, status) VALUES (?, ?, ?);`

        await db.query(SQL, [id_enunciado, usuario.id, EstadoVotacao.APRESENTACAO_ENUNCIADO]);
    }

    
    static async parar(db: PoolConnection, usuario: Usuario){
        // Verifica a permissão do usuário.
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        // Qualquer administrador (Presidente / Relator) pode parar ou inicio a votação.
        if( permissoes.administrar_comissoes.length === 0)
            throw createHttpError.BadRequest("Usuário sem permissão para 'Finalizar a votação'.");

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

        // Determina o SQL que deve ser executado.
        const SQL_GERAL = `UPDATE votacao 
                            JOIN ( SELECT MAX(id) as max_id FROM votacao limit 1) as T
                            SET fim = now(), status = ${EstadoVotacao.FINALIZADO}
                            WHERE T.max_id = votacao.id;`

                            
        const SQL_POR_COMISSAO = 
            `UPDATE votacao
                JOIN (
                    SELECT max(id) as max_id FROM votacao 
                    JOIN statement ON statement_id = votacao.enunciado
                    WHERE committee_id = ?
                ) as T
                SET votacao.fim = now(), status = ${EstadoVotacao.FINALIZADO}
                WHERE id = T.max_id;`

        const SQL = por_comissao ? SQL_POR_COMISSAO : SQL_GERAL;
        const params = por_comissao ? permissoes.administrar_comissoes : [];

        await db.query(SQL, params);
    }

}

export default VotacaoDAO;