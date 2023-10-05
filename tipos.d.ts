
type AxiosInstance = import('axios').AxiosInstance;
type PoolConnection = import('mysql2/promise').PoolConnection;

interface API {
    req: import('next').NextApiRequest;
    res: import('next').NextApiResponse;
    db: PoolConnection;
    usuario?: Usuario;
}

interface UsuarioSiga {
    identidadeId: string;
    cadastranteId: string;
    cadastranteSigla: string;
    cadastranteNome: string;
    cadastranteCpf: string;
    lotaCadastranteId: string;
    lotaCadastranteSigla: string;
    lotaCadastranteNome: string;
    titularId: string;
    titularSigla:string;
    titularNome: string;
    titularCpf: string;
    lotaTitularId: string;
    lotaTitularSigla: string;
    lotaTitularNome: string;
    substituicoesPermitidas: [];
}

interface SIGA_API_V1_USUARIO {
    usuario : UsuarioSiga
}

interface Usuario {
    nome: string;
    matricula: string,
    lotacao: string,

    permissoes: {
        administrar_comissoes: number [],
        crud: boolean,
        estatistica: boolean,
        votar_comissoes : number [],
    }
}

interface Forum {
    forum_id : number,
    forum_name: string;
}

interface Mensagem {
    texto: string;
    titulo: string;
    acao?: ()=> void;
}

interface Contexto {
    forum: Forum,
    usuario: Usuario,
    exibirNotificacao: (msg: Mensagem) => void;
    api: AxiosInstance;
}

interface Comite {
    committee_id: number,
    forum_id: number,
    committee_name: string,
    committee_chair_name: string,
    committee_chair_document: string,
    committee_description: string,
}

interface Enunciado {
    statement_id: number;
    forum_id: number;
    attendee_id: number;
    committee_id: number;
    statement_text: string;
    statement_justification: string;
    
    data_analise: string | null;
    analisado_por: string | null;
    admitido: 0 | 1 | null;
}

interface Ocupacao {
    occupation_id: number,
    forum_id: number,
    occupation_name: string,
 }