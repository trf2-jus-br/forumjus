import createHttpError from "http-errors";
import PermissaoDAO from "./permissao";
import EnunciadoDAO from "./enunciado";
import CalendarioDAO from "./calendario";

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
                committee_name as comissao
            FROM votacao
                LEFT JOIN statement on statement_id = votacao.enunciado
                LEFT JOIN committee on statement.committee_id = committee.committee_id
            WHERE 
                statement.committee_id = ? AND
                inicio < now() AND
                fim IS NULL;`

        const SQL_ENUNCIADO_GERAL = 
            `SELECT 
                votacao.id as votacao,
                statement_text as texto,
                statement_justification as justificativa,
                committee_name as comissao
            FROM votacao
                LEFT JOIN statement on statement_id = votacao.enunciado
                LEFT JOIN committee on statement.committee_id = committee.committee_id
            WHERE fim IS NULL`;
        
        const SQL_ENUNCIADO = votacao_geral ? SQL_ENUNCIADO_GERAL : SQL_ENUNCIADO_POR_COMISSAO;
        const params_enunciados = votacao_geral ? [] : [comissao];

        const [enunciados] = await db.query(SQL_ENUNCIADO, params_enunciados);

        if(enunciados.length === 0)
            return null;
        
        const SQL_VOTO = 
            `SELECT 
                membro.id,
                membro.nome,
                CAST(V.voto as SIGNED) voto
            FROM membro
            LEFT JOIN (
                SELECT * FROM voto where votacao = ?
            ) V on V.membro = membro.id
            ORDER BY V.data DESC;`

        const [votos] = await db.query(SQL_VOTO, [
            enunciados[0].votacao,
            comissao
        ])

        return {
            votacao: enunciados[0].votacao,
            texto: enunciados[0].texto,
            justificativa: enunciados[0].justificativa,
            comissao: enunciados[0].comissao,
            votos : votos
        }
    }

    static async votar(db: PoolConnection, usuario: Usuario, votacao: number, favoravel: boolean){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        // Não verifico se o usuário pode votar na comissão específica.
        // Até porque no 2º dia, todos votam em todas as comissões.
        if(permissoes.votar_comissoes.length === 0)
            throw "Usuário sem Permissão para votar";

        await db.query(`INSERT INTO voto (votacao, membro, voto) VALUES (?, ?, ?)`, [votacao, usuario.id, favoravel]);
    }


    static async iniciar(db: PoolConnection, usuario: Usuario, id_enunciado: number){
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

        // Verifica os enunciados que já foram votados na etapa atual, seja 1º ou 2º dia.
        const [votacoes] = await db.query(
            `SELECT 
                enunciado, inicio, fim 
            FROM votacao 
            WHERE 
                ? > inicio;`, 
            [ 
                (por_comissao || geral).inicio
            ]
        ) as any[]

        // Verifica se não há nenhuma votação em andamento.
        const votacao_andamento = votacoes.find(e => e.fim == null);

        if(votacao_andamento)
            throw createHttpError.BadRequest("Já há uma votação em andamento.");

        // Verifica se o enunciado já foi votado.
        // Na 1ª votação, o enunciado numa foi votado.
        // Na 2ª votação, o enunciado possui um voto.
        const num_votacoes = votacoes.filter(e => e.enunciado == id_enunciado).length;

        if(por_comissao && num_votacoes > 0 || geral && votacao_andamento > 1 ){
            throw createHttpError.BadRequest("Enunciado já foi votado.");
        }

        // Caso esteja tudo certo, inicia a votação.
        const SQL = `INSERT INTO votacao(enunciado, iniciada_por) VALUES (?, ?);`

        await db.query(SQL, [id_enunciado, usuario.id]);
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
        const SQL_GERAL = `UPDATE votacao SET fim = now();`

        const SQL_POR_COMISSAO = 
            `UPDATE votacao
                INNER JOIN statement on votacao.enunciado = statement_id
                SET votacao.fim = now()
                WHERE committee_id = ?;`

        const SQL = por_comissao ? SQL_POR_COMISSAO : SQL_GERAL;
        const params = por_comissao ? permissoes.administrar_comissoes : [];

        await db.query(SQL, params);
    }

}

export default VotacaoDAO;