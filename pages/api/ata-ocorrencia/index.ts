import { apiHandler, apiPermitidaAo } from "../../../utils/apis";


async function inicio_fim_trabalhos(db: PoolConnection, comite: number | string) : Promise<{inicio: string, fim: string}>{
    const SQL_GERAL = `SELECT 
                    time(min(inicio)) as inicio, 
                    time(max(fim)) as fim 
                FROM 
                    votacao_detalhada_2 
                WHERE evento = 'VOTAÇÃO GERAL';`


        const SQL_POR_COMISSAO = `SELECT 
                                    time(min(inicio)) as inicio, 
                                    time(max(fim)) as fim 
                                FROM 
                                    votacao_detalhada_2 
                                WHERE evento = 'VOTAÇÃO POR COMISSÃO' AND committee_id = ?;`


    const SQL = comite == null ? SQL_GERAL : SQL_POR_COMISSAO;
    const PARAMS = comite == null ? [] : [comite];

    return (await db.query(SQL, PARAMS))[0][0] as any;
}

async function presentes(db: PoolConnection, comite: number | string){
    const SQL_GERAL = `SELECT 
                            id, nome, funcao, comite,
                            id in (
                                SELECT 
                                    membro
                                FROM presenca 
                                JOIN votacao_detalhada_2 
                                WHERE 
                                    ( (saida IS NULL OR saida >= votacao_detalhada_2.inicio) AND (entrada <= votacao_detalhada_2.fim OR votacao_detalhada_2.fim IS NULL) ) AND
                                    evento = 'VOTAÇÃO GERAL'
                            ) as presente
                        FROM membro;`

    const SQL_POR_COMISSAO = `SELECT 
                                id, nome, funcao, comite,
                                id in (
                                    SELECT 
                                        membro
                                    FROM presenca 
                                    JOIN votacao_detalhada_2 
                                    WHERE 
                                        ( (saida IS NULL OR saida >= votacao_detalhada_2.inicio) AND (entrada <= votacao_detalhada_2.fim OR votacao_detalhada_2.fim IS NULL) ) AND
                                        evento = 'VOTAÇÃO POR COMISSÃO'
                                ) as presente
                            FROM membro 
                            WHERE comite = ? OR comite IS NULL;`

    const SQL = comite == null ? SQL_GERAL : SQL_POR_COMISSAO;
    const PARAMS = comite == null ? [] : [comite];

    return (await db.query(SQL, PARAMS))[0] as any;
}


async function enunciados(db: PoolConnection, comite: number | string){
    const SQL_GERAL = `SELECT 
                            statement.*, 
                            aprovado,
                            quorum,
                            favor 
                        FROM votacao_detalhada_2
                        JOIN 
                            statement ON statement_id = enunciado
                        WHERE 
                            evento = 'VOTAÇÃO GERAL';`

    const SQL_POR_COMISSAO = `SELECT 
                                    statement.*, 
                                    aprovado,
                                    quorum,
                                    favor
                                FROM votacao_detalhada_2
                                JOIN 
                                    statement ON statement_id = enunciado
                                WHERE 
                                    evento = 'VOTAÇÃO POR COMISSÃO' AND statement.committee_id = ?;`

    const SQL = comite == null ? SQL_GERAL : SQL_POR_COMISSAO;
    const PARAMS = comite == null ? [] : [comite];

    return (await db.query(SQL, PARAMS))[0] as any;
}

async function ato({db, usuario, req} : API){
    apiPermitidaAo(usuario, "PRESIDENTA", "PRESIDENTE", "PROGRAMADOR", "RELATOR", "RELATORA");

    const {comite} = req.query;

    const trabalhos = await inicio_fim_trabalhos(db, comite as string);
    const membros = await presentes(db, comite  as string);
    const _enunciados = await enunciados(db, comite as string);

    return {
        inicio: trabalhos.inicio,
        fim: trabalhos.fim,
        membros,
        enunciados: _enunciados
    }
}


export default apiHandler({
    GET: ato
})

