import createHttpError from "http-errors";

enum CADERNO{
    TODOS = -1,
    ADMITIDO = 0,
    PRIMEIRA_VOTACAO = 1,
    SEGUNDA_VOTACAO = 2,
}

class CadernoDAO {
    static async cadernoTodasInscricoes(db: PoolConnection, usuario: Usuario, comissao : number){
        if(usuario.funcao === "MEMBRO")
            throw createHttpError.BadRequest(`${usuario.funcao} não tem permissão para acessar os cadernos.`)

        //-1, 0, 1, 2: Todos, Premilinar, 1ª votação, 2ª votação
        const SQL = 
            `SELECT 
                statement.*,
                attendee.attendee_name,
                attendee.attendee_chosen_name,
                attendee.attendee_timestamp,
                attendee.attendee_affiliation,
                occupation_name
            FROM statement
            INNER JOIN attendee ON attendee.attendee_id = statement.attendee_id
            INNER JOIN occupation ON occupation.occupation_id = attendee.occupation_id
            WHERE committee_id = ?
            ORDER BY statement.statement_id ASC;`

        const [resultado] = await db.query(SQL, [comissao]);

        return resultado as Enunciado[];        
    }
    
    static async cadernoPrelinar(db: PoolConnection, usuario: Usuario, comissao : number){
        if(usuario.funcao === "MEMBRO")
            throw createHttpError.BadRequest(`${usuario.funcao} não tem permissão para acessar os cadernos.`)

        //0, 1, 2: Premilinar, 1ª votação, 2ª votação
        const SQL = 
            `SELECT 
                statement.*,
                attendee.attendee_name,
                attendee.attendee_chosen_name,
                attendee.attendee_timestamp,
                attendee.attendee_affiliation,
                occupation_name
            FROM statement
            INNER JOIN attendee ON attendee.attendee_id = statement.attendee_id
            INNER JOIN occupation ON occupation.occupation_id = attendee.occupation_id
            WHERE committee_id = ? AND admitido = 1
            ORDER BY codigo ASC;`

        const [resultado] = await db.query(SQL, [comissao]);

        return resultado as Enunciado[];        
    }

    static async cadernoVotacao(db: PoolConnection, usuario: Usuario, comissao : number, nivel : number){
        //0, 1, 2: Premilinar, 1ª votação, 2ª votação
        if(usuario.funcao === "MEMBRO")
            throw createHttpError.BadRequest(`${usuario.funcao} não tem permissão para acessar os cadernos.`)

        const SQL_GERAL = 
            `SELECT 
                statement.*,
                attendee.attendee_name,
                attendee.attendee_chosen_name,
                attendee.attendee_timestamp,
                attendee.attendee_affiliation,
                occupation_name
            FROM statement
            INNER JOIN attendee ON attendee.attendee_id = statement.attendee_id
            INNER JOIN occupation ON occupation.occupation_id = attendee.occupation_id
            INNER JOIN votacao_detalhada_2 ON votacao_detalhada_2.enunciado = statement_id
            WHERE evento = 'VOTACAO GERAL' AND aprovado ${ comissao ? ' AND statement.committee_id = ?' : '' }
            ORDER BY statement.committee_id ASC, statement.codigo;`

        const SQL_ESPECIFICO = 
            `SELECT 
                statement.*,
                attendee.attendee_name,
                attendee.attendee_chosen_name,
                attendee.attendee_timestamp,
                attendee.attendee_affiliation,
                occupation_name
            FROM statement
            INNER JOIN attendee ON attendee.attendee_id = statement.attendee_id
            INNER JOIN occupation ON occupation.occupation_id = attendee.occupation_id
            INNER JOIN votacao_detalhada_2 ON votacao_detalhada_2.enunciado = statement_id
            WHERE evento = 'VOTACAO POR COMISSAO' AND aprovado AND statement.committee_id = ?;`

        const SQL = nivel == CADERNO.PRIMEIRA_VOTACAO ? SQL_ESPECIFICO : SQL_GERAL;

        const params = comissao ? [comissao] : [];

        const [resultado] = await db.query(SQL, params);

        return resultado as Enunciado[];        
    }
}

export default CadernoDAO;