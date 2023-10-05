import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../utils/apis";
import jwt from "../../utils/jwt";
import axios from "axios";
import PermissaoDAO from "../../db/permissao";

async function carregarDados(db: PoolConnection, token: string) : Promise<Usuario>{
    // busca os dados do usuário ( identificado pelo jwt)
    const { data } = await axios.get<SIGA_API_V1_USUARIO>('https://siga.jfrj.jus.br/siga/api/v1/usuario', {
        headers: {
            Authorization: token
        }
    })

    const permissoes = await PermissaoDAO.carregar(db, data.usuario);

    return {
        nome: data.usuario.titularNome,
        matricula: data.usuario.titularSigla,
        lotacao: data.usuario.lotaTitularSigla,
        permissoes
    };
}
    
async function logar({req, res, db} : API){
    // obtém o login e senha
    const auth = req.headers.authorization;

    // envia pro servidor do siga
    const resposta = await fetch('https://siga.jfrj.jus.br/siga/api/v1/autenticar', {
        method: 'POST',
        headers: {
            Authorization: auth
        }
    });

    // caso http status seja diferente de 200, encaminha o erro enviado pelo SIGA.
    if(!resposta.ok){
        return res.status(resposta.status).send(await resposta.text());
    }

    const {token : SIGA_token} = await resposta.json();

    // carrega as informações como nome, matricula e lotação utilizando a token gerada no login.
    const usuario = await carregarDados(db, SIGA_token );

    // Não enviamos a token do SIGA pro usuário, pois não conseguiríamos validar se o usuário alterou ela.
    // Por essa razão criamos outro JWT utilizando.
    const FORUM_token = await jwt.buildJwt(usuario);

    // Salvamos no cookie um JWT que será utilizado exclusivamente para validar o login.
    res.setHeader("Set-Cookie", [
        `forum_token=${FORUM_token}; Secure; HttpOnly; Path=/api`,
        `forum_usuario=${JSON.stringify(usuario)}; Secure; Path=/`
    ])

    res.status(200).send(usuario);
}

function logout({res}: API){
    res.setHeader("Set-Cookie", [
        `forum_token=deslogado; Secure; HttpOnly; Path=/api; Max-Age=-1`,
        `forum_usuario=deslogado; Secure; Path=/; Max-Age=-1`
    ])

    res.status(200).send(null);
}

export default apiHandler({
    "POST": logar,
    "DELETE": logout
})