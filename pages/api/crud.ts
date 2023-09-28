import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";
import { carregarUsuario } from "../../middleware";

async function validarPermissao(req: NextApiRequest){
    const usuario = await carregarUsuario(req);

    const permissoes = await mysql.carregarPermissoes(usuario.matricula);

    if(!permissoes.crud)
        throw "Usuário sem permissão";

    return usuario;
}

async function listar(req: NextApiRequest, res: NextApiResponse){
    await validarPermissao(req);

    const {tabela} = req.query;

    
    const result = await mysql.carregar({tabela});
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