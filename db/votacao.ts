import createHttpError from "http-errors";
import PermissaoDAO from "./permissao";
import CalendarioDAO from "./calendario";
import { EstadoVotacao } from "../utils/enums";

class VotacaoDAO {
    static async listar(db: PoolConnection, usuario: Usuario){
        const calendario = await CalendarioDAO.hoje(db);
        const votacao_geral = calendario.find(c => c.evento === "VOTAÇÃO GERAL");

        const comissao = usuario.permissoes.votar_comissoes[0];

        const SQL_ENUNCIADO_POR_COMISSAO = 
            `SELECT 
                votacao.id as votacao,
                statement_text as texto,
                statement_justification as justificativa,
                committee_name as comissao,
                timestampdiff(second, votacao.inicio, now()) as inicio_defesa,
                votacao.status
            FROM votacao
                LEFT JOIN statement on statement_id = votacao.enunciado
                LEFT JOIN committee on statement.committee_id = committee.committee_id
            WHERE 
                statement.committee_id = ?
            ORDER BY id DESC 
            LIMIT 1;`

        const SQL_ENUNCIADO_GERAL = 
            `SELECT 
                votacao.id as votacao,
                statement_text as texto,
                statement_justification as justificativa,
                committee_name as comissao,
                timestampdiff(second, votacao.inicio, now()) as inicio_defesa,
                votacao.status
            FROM votacao
                LEFT JOIN statement on statement_id = votacao.enunciado
                LEFT JOIN committee on statement.committee_id = committee.committee_id
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

        return {
            votacao: enunciados[0].votacao,
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

    static async alterar(db: PoolConnection, enunciado: number, estadoVotacao: EstadoVotacao){
        const SQL = `UPDATE votacao SET status = ?, inicio = now() WHERE enunciado = ? ORDER BY id DESC LIMIT 1;`
        await db.query(SQL, [estadoVotacao, enunciado]);  
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
        const SQL_GERAL = `UPDATE votacao SET fim = now(), status = ${EstadoVotacao.FINALIZADO};`

        const SQL_POR_COMISSAO = 
            `UPDATE votacao
                INNER JOIN statement on votacao.enunciado = statement_id
                SET votacao.fim = now(), status = ${EstadoVotacao.FINALIZADO}
                WHERE committee_id = ?;`

        const SQL = por_comissao ? SQL_POR_COMISSAO : SQL_GERAL;
        const params = por_comissao ? permissoes.administrar_comissoes : [];

        await db.query(SQL, params);
    }

}

export default VotacaoDAO;