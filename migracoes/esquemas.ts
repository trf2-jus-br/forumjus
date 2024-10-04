import type { NextApiRequest } from 'next';
import type { QueryRunner } from 'typeorm';

type Esquema = "trfForumJus3" | "trfForumJus2" | "trfForumJus";

interface Jornada {
    nome: string;
    enderecos: string[];
    esquema: Esquema;
}

export async function esquemaAtual(queryRunner: QueryRunner) : Promise<Esquema>{
    const r = await queryRunner.query(`SELECT database() as db;`);
    return r[0].db;
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
            nome: 'Jornada 3 - FOJURJ', 
            esquema: 'trfForumJus3',
            enderecos: [
                'localhost:8081', 'jornada3-hmg.trf2.jus.br', 'jornadafojurj.trf2.jus.br'
            ]
        },
        { 
            nome: 'Jornada 2 - FDHF', 
            esquema: 'trfForumJus2',
            enderecos: [
                'jornada2:8081', 'jornada2-hmg.trf2.jus.br',
                
                // A jornada atual é a 2ª Jornada.
                'localhost2:8081', 'jornada-hmg.trf2.jus.br', 'jornada.trf2.jus.br'
            ]
        },
        { 
            nome: 'I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região', 
            esquema: 'trfForumJus',
            enderecos: [
                'jornada1:8081', 'jornada1-hmg.trf2.jus.br',
                'jornada1.trf2.jus.br'
            ]
        },
    ]
}  