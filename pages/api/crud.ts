import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import mysql from "../../utils/mysql";
import PermissaoDAO from "../../db/permissao";
import CRUD from "../../db/crud";

async function validarPermissao(db: PoolConnection, usuario: Usuario){
    const permissoes = await PermissaoDAO.carregar(db, usuario);

    if(!permissoes.crud)
        throw "Usuário sem permissão";
}

async function listar({req, res, db, usuario}: API){
    await validarPermissao(db, usuario);

    const tabela : string = req.query.tabela;

    res.send(
        await CRUD.carregar(db, tabela)
    )
}

async function editar({req, res, db, usuario}: API){
    await validarPermissao(db, usuario);

    const {linha, coluna, valor} = JSON.parse(req.body) as any; 
    const {tabela, nome_id} = req.query as any;
    
    await CRUD.atualizarBanco(
        db,
        tabela,
        nome_id,
        linha[nome_id],
        coluna, 
        valor, 
        usuario
    );

    res.status(200).send(null);
}

async function deletar({req, res, db, usuario}: API){
    await validarPermissao(db, usuario);

    const {linha} = JSON.parse(req.body) as any; 
    const {tabela, nome_id} = req.query as any;

    await CRUD.deletarLinha(
        db,
        tabela,
        nome_id,
        linha[nome_id],
        usuario
    )

    res.status(200).send(null);
}

async function criar({req, res, db, usuario}: API){
    await validarPermissao(db, usuario);

    const linha = JSON.parse(req.body) as any; 
    const {tabela, nome_id} = req.query as any;

    await CRUD.criarLinha(
        db,
        tabela,
        linha,
        usuario
    )

    res.status(200).send(null);
}

export default apiHandler({
    "GET" : listar,
    "PATCH": editar,
    "DELETE": deletar,
    "POST": criar
}) 