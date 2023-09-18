import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";

async function validarPermissao(req: NextApiRequest){
    const doc = req.cookies['doc'];

    if(!doc)
        throw "Usuário não está logado no gov.br"

    return doc;
}

async function listar(req: NextApiRequest, res: NextApiResponse){
    const doc = await validarPermissao(req);

    
    const result = await mysql.carregarVotacaoComites(doc);
    res.send(result)
}

async function editar(req: NextApiRequest, res: NextApiResponse){
    const usuario = await validarPermissao(req);

    const {linha, coluna, valor} = JSON.parse(req.body); 
    const {tabela, nome_id} = req.query;
    
    await mysql.atualizarBanco({
        tabela,
        nome_id,
        id : linha[nome_id],
        coluna, 
        valor, 
        usuario
    })

    res.status(200).send(null);
}

async function deletar(req: NextApiRequest, res: NextApiResponse){
    const usuario = await validarPermissao(req);

    const {linha} = JSON.parse(req.body); 
    const {tabela, nome_id} = req.query;

    await mysql.deletarLinha({
        tabela,
        nome_id,
        id : linha[nome_id],
        usuario
    })

    res.status(200).send(null);
}

async function criar(req: NextApiRequest, res: NextApiResponse){
    const usuario = await validarPermissao(req);

    const linha = JSON.parse(req.body); 
    const {tabela, nome_id} = req.query;

    await mysql.criarLinha({
        tabela,
        linha,
        usuario
    })

    res.status(200).send(null);
}

export default apiHandler({
    "GET" : listar,
    "PATCH": editar,
    "DELETE": deletar,
    "POST": criar
}) 