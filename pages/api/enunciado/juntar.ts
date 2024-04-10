import { ResultSetHeader } from "mysql2";
import { apiHandler, apiPermitidaAo } from "../../../utils/apis";

interface ReqJuncao {
    juncao: number, 
    codigo: number, 
    texto: string, 
    justificativa: string,
    comite: number, 
    enunciados: number[]
}

async function listarEnunciadosJuntados({db, usuario} : API){
    apiPermitidaAo(usuario, "PRESIDENTA", "PRESIDENTE", "RELATOR", "RELATORA");

    const SQL = `SELECT 
                    statement.*,
                    juncao,
                    juncao.texto as juncao_texto,
                    juncao.justificativa as juncao_justificativa
                FROM statement 
                LEFT JOIN juncao_enunciado ON enunciado = statement_id
                LEFT JOIN juncao ON juncao.id = juncao_enunciado.juncao;`

    const [resultado] = await db.query(SQL);

    return resultado;
}

async function juntar({usuario, db, req} : API){
    apiPermitidaAo(usuario, "PRESIDENTA", "PRESIDENTE", "RELATOR", "RELATORA");

    const {juncao, codigo, texto, justificativa, comite, enunciados} = req.body as ReqJuncao;

    if(juncao == null){
        const VALUES = enunciados.map(e => '(?, LAST_INSERT_ID())').join(',');

        await db.query('INSERT INTO juncao (codigo, comite, texto, justificativa) VALUES (?, ?, ?, ?);', [codigo, comite, texto, justificativa])
        await db.query(`INSERT INTO juncao_enunciado (enunciado, juncao) VALUE ${VALUES};`, enunciados)
    }else{
        if(!Number.isInteger(juncao))
            throw "parâmetro junção deve ser um inteiro.";

        const VALUES = enunciados.map(e => `(?, ${juncao})`).join(',');

        await db.query('UPDATE juncao SET codigo = ?, comite = ?, texto = ?, justificativa = ? WHERE id = ?;', [codigo, comite, texto, justificativa, juncao]);        
        await db.query('DELETE FROM juncao_enunciado WHERE juncao = ?;', [juncao]);
        await db.query(`INSERT INTO juncao_enunciado (enunciado, juncao) VALUE ${VALUES};`, enunciados);
    }
}

export default apiHandler({
    GET: listarEnunciadosJuntados,
    PUT: juntar
})