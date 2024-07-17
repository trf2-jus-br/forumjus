import { apiHandler } from "../../utils/apis";
import PermissaoDAO from "../../db/permissao";
import CRUD from "../../db/crud";
import { ArquivoDAO } from "../../db/arquivo";

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

    const [campos, arquivo] = await ArquivoDAO.processar(db, req);

    const linha = JSON.parse(campos.linha[0]);
    const coluna = JSON.parse(campos.coluna[0]);
    const valor =  arquivo || JSON.parse(campos.valor[0]);

    const {tabela, nome_id} = req.query as any;

    await CRUD.atualizarBanco(
        db,
        tabela,
        nome_id,
        coluna, 
        valor,
        linha[nome_id],
        usuario
    );

    res.status(200).send(null);
}

async function deletar({req, res, db, usuario}: API){
    await validarPermissao(db, usuario);

    // devido a possibilidade de manipulação de arquivos. 'body-parser' foi desabilitado.
    const [campos] = await ArquivoDAO.processar(db, req);

    const linha = JSON.parse(campos.linha[0]) as any; 
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

    // devido a possibilidade de manipulação de arquivos. 'body-parser' foi desabilitado.
    const [campos] = await ArquivoDAO.processar(db, req);

    const linha = JSON.parse(campos.linha[0]) as any; 
    const {tabela, nome_id} = req.query as any;

    await CRUD.criarLinha(
        db,
        tabela,
        linha,
        usuario
    )

    res.status(200).send(null);
}

export const config = {
    api: {
      bodyParser: false, // Defaults to true. Setting this to false disables body parsing and allows you to consume the request body as stream or raw-body.
    },
};

export default apiHandler({
    "GET" : listar,
    "PATCH": editar,
    "DELETE": deletar,
    "POST": criar
}) 