import createHttpError from "http-errors";
import PermissaoDAO from "./permissao";
import EnunciadoDAO from "./enunciado";

class VotacaoDAO {
    static async listar(db: PoolConnection, usuario: Usuario){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        if(permissoes.votar_comissoes.length === 0)
            throw createHttpError.Forbidden("Usuário sem Permissão.");

        const comissao = permissoes.votar_comissoes[0];

        const SQL_ENUNCIADO = 
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

        const SQL_VOTO = 
            `SELECT 
                membro.id,
                membro.nome,
                CAST(V.voto as SIGNED) voto
            FROM membro
                LEFT JOIN (
                    SELECT * FROM voto where votacao = ?
                ) V on V.membro = membro.id
            WHERE 
                comite = ?
            ORDER BY V.data DESC;`


        const [enunciados] = await db.query(SQL_ENUNCIADO, [comissao]);

        if(enunciados.length === 0)
            return null;
        

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


    static async iniciar(db: PoolConnection, usuario: Usuario, id_enunciado: number, dia: 1 | 2){
        const permissoes = await PermissaoDAO.carregar(db, usuario);

        //const enunciado = await EnunciadoDAO.listarPorId(db, usuario, id_enunciado);
        //CRIAR AS VALIDAÇÕES...

        if(permissoes.administrar_comissoes.length === 0)
            throw createHttpError.Forbidden("Usuário não tem permissão para iniciar votação");

        const SQL = `INSERT INTO votacao(enunciado, iniciada_por) VALUES (?, ?);`

        await db.query(SQL, [id_enunciado, usuario.id]);
    }

    
    static async parar(db: PoolConnection, usuario: Usuario, enunciado : number){

    }

}

export default VotacaoDAO;