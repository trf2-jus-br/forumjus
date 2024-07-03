import type { NextApiRequest } from 'next';
import pool from '../utils/mysql';
import type { PoolConnection, RowDataPacket } from 'mysql2/promise.js';

interface Jornada {
    nome: string;
    enderecos: string[];
    esquema: string;
}

export function verificaEsquemaSeguro(esquema : string){
    if(!esquema || esquema.match('[^a-zA-Z0-9]'))
        throw `Esquema não permitido ${esquema}`;
}

export async function carregarEsquema(req: NextApiRequest) : Promise<string> {
    // define a origem da requisição
    const host : string = req.headers['x-forwarded-host'] as string || req.headers['host'];
    
    const jornadas = await carregarJornadas();

    // relaciona a origem da requisição com o esquema do banco.
    const jornada = jornadas.find(j => j.enderecos.indexOf(host) !== -1)

    // Verifica se a relação foi realizada com sucesso.
    if(!jornada)
        throw `Host não cadastrado: '${host}'.`

    return jornada.esquema;
}

export async function carregarJornadas() : Promise<Jornada[]>{
    return [
        { 
            nome: 'Jornada 3', 
            esquema: 'trfForumJus3',
            enderecos: [
                'jornada3:8081', 'jornada3-hmg.trf2.jus.br'
            ]
        },
        { 
            nome: 'Jornada 2', 
            esquema: 'trfForumJus2',
            enderecos: [
                'jornada2:8081', 'localhost:8081', 'jornada2-hmg.trf2.jus.br'
            ]
        },
    ]
}  