import { apiHandler } from "../../utils/apis";
import jwt from "../../utils/jwt";
import xml2js from 'xml2js';
import axios, { AxiosResponse } from "axios";
import createHttpError from "http-errors";
import LogDAO from "../../db/log";

// Verifica as credenciais e obtém os dados do banco.
async function logarCracha(db: PoolConnection, token: string) : Promise<Usuario>{
    // verifica se a token existe no banco de dados.
    const [consulta] = await db.query('SELECT * FROM membro WHERE token = ?;', [token]);
    const membro = consulta[0] as Membro;

    if(!membro)
        throw createHttpError(403, "logarCracha: Token informada não existe.");

    // diferencia 'MEMBRO', 'RELATOR' e 'PRESIDENTE'
    const administrador = membro.funcao === "PRESIDENTE" || membro.funcao === "PRESIDENTA"  || membro.funcao === "RELATOR" || membro.funcao === "RELATORA";

    // Ao logar com uma token, não será concedido acesso as páginas de estatistica ou 'crud'.
    // Ao PRESIDENTE e ao RELATOR são dados a permissão de administar e votar em uma comissão.
    return {
        id: membro.id,
        token,
        funcao: membro.funcao,
        lotacao: null,
        matricula: null,
        nome: membro.nome,
        permissoes: {
            administrar_comissoes:  administrador ? [ membro.comite ] : [],
            crud: false,
            estatistica: false,
            votar_comissoes: [ membro.comite ]
        }
    }
    
}

// Verifica as credenciais, obtém os dados do usuário através do SIGA.
async function logarSiga(db: PoolConnection, auth: string) : Promise<Usuario>{
    try{
        // envia as credenciais pro servidor do siga
        const {data: resposta_login} = await axios.post<SIGA_API_V1_LOGIN>('https://siga.jfrj.jus.br/siga/api/v1/autenticar', null, {
            headers: {
                Authorization: auth
            }
        });

        // busca os dados do usuário ( identificado pelo jwt)
        const { data } = await axios.get<SIGA_API_V1_USUARIO>('https://siga.jfrj.jus.br/siga/api/v1/usuario', {
            headers: {
                Authorization: resposta_login.token
            }
        })

        // monta a requisição SOAP que buscará as permissões do usuário
        const requisicaoSoap = 
            `<soapenv:Envelope 
                xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                xmlns:impl="http://impl.service.gi.siga.jfrj.gov.br/"
            >
                <soapenv:Header/>
                <soapenv:Body>
                    <impl:acesso>
                    <arg0>${data.usuario.titularSigla}</arg0>
                    <arg1></arg1>
                    <arg2>FORUMJUS</arg2>
                    </impl:acesso>
                </soapenv:Body>
            </soapenv:Envelope>`;

        // obtém as permissões
        const {data: respostaGI} = await axios.post('https://siga.jfrj.jus.br/siga/servicos/GiService', requisicaoSoap); 

        // converte o xml em objeto
        const acesso : SIGA_GI_ACESSO = await xml2js.parseStringPromise(respostaGI) 

        // obtem a string de resposta
        const permissao = JSON.parse(
            acesso['soap:Envelope']['soap:Body'][0]['ns2:acessoResponse'][0]['return'][0]
        ); 
        
        // verifica se o usuário tem permissão.
        if(permissao?.FORUMJUS !== "Pode")
            throw createHttpError(403, "Usuário sem permissão para acessar o sistema. Verifique a propriedade 'FORUMJUS' no SIGA GI.");

        // Ao logar pelo siga, o usuário terá a permissão 'estatística' e
        // caso seja da COSADM terá acesso a 'CRUD'
        const COSADM = false //data.usuario.lotaTitularSigla === "COSADM";
        return {
            funcao: COSADM ? "PROGRAMADOR" : "ASSESSORIA",
            nome: data.usuario.titularNome,
            matricula: data.usuario.titularSigla,
            lotacao: data.usuario.lotaTitularSigla,
            permissoes : {
                administrar_comissoes: [],
                votar_comissoes: [],
                crud: COSADM,
                estatistica: true,
            }
        };
    }catch(err){
        // caso http status seja diferente de 200, encaminha o erro enviado pelo SIGA.
        const res = err?.response as AxiosResponse;
        if(res) 
            throw createHttpError(res.status, res.data?.errormsg);

        throw err;
    }
}

async function logar({req, res, db} : API){
    // obtém o login e senha
    const auth = req.headers.authorization;
    let cracha = req.query['cracha'] === 'true';

    const usuario = await (cracha ? logarCracha : logarSiga)(db, auth);

    LogDAO.registrar(db, usuario, "login", {});

    // Não enviamos a token do SIGA pro usuário, pois não conseguiríamos validar se o usuário alterou ela.
    // Por essa razão criamos outro JWT utilizando.
    const FORUM_token = await jwt.buildJwt(usuario);

    // Salvamos no cookie um JWT que será utilizado exclusivamente para validar o login.
    res.setHeader("Set-Cookie", [
        `forum_token=${FORUM_token}; Secure; HttpOnly; Path=/api`,
        `forum_usuario=${JSON.stringify(usuario)}; Secure; Path=/`
    ])

    delete usuario.matricula;

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