import createHttpError from "http-errors";

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
            INNER JOIN (
                SELECT 
                    votacao.id, 
                    votacao.enunciado,
                    sum(voto.voto) AS favor,
                    sum(1 - voto.voto) AS contra
                FROM voto
                INNER JOIN votacao ON votacao.id = voto.votacao
                GROUP BY votacao.id, votacao.enunciado
                HAVING favor > contra        
            ) as resultado_votacao 
                ON statement_id = resultado_votacao.enunciado
            INNER JOIN committee 
                ON committee.committee_id = statement.committee_id
            GROUP BY statement_id
            HAVING count(resultado_votacao.id) >= ?
            ORDER BY codigo asc;`

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
            INNER JOIN (
                SELECT 
                    votacao.id, 
                    votacao.enunciado,
                    sum(voto.voto) AS favor,
                    sum(1 - voto.voto) AS contra
                FROM voto
                INNER JOIN votacao ON votacao.id = voto.votacao
                GROUP BY votacao.id, votacao.enunciado
                HAVING favor > contra        
            ) as resultado_votacao
            ON statement_id = resultado_votacao.enunciado
            WHERE committee_id = ?
            GROUP BY statement_id
            HAVING count(resultado_votacao.id) >= ?
            ORDER BY codigo asc;
        `
        const SQL = comissao ? SQL_ESPECIFICO : SQL_GERAL;
        const params = comissao ? [comissao, nivel] : [nivel];

        const [resultado] = await db.query(SQL, params);

        return resultado as Enunciado[];        
    }
}

export default CadernoDAO;