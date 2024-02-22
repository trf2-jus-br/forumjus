
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

interface SIGA_GI_ACESSO {
    'soap:Envelope' : {
        'soap:Body' : {
            'ns2:acessoResponse' : {
                return: string
            }[]
        }[]
    }
}

interface SIGA_API_V1_LOGIN {
    token : string
}

interface Usuario {
    id?: number,
    token?: string;
    funcao: FuncaoMembro,
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
    titulo?: string;
    tipo?: "SUCESSO" | "ERRO";
    acao?: ()=> void;
}

interface Contexto {
    forum: Forum,
    usuario: Usuario,
    exibirNotificacao: (msg: Mensagem, modal?: boolean) => void;
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

type DetalheComite = Comite & {
    enunciados : number
}

type Inscricao = Proponente & Enunciado;

interface Enunciado {
    statement_id: number;
    forum_id: number;
    attendee_id: number;
    committee_id: number;
    statement_text: string;
    statement_justification: string;
    justificativa_analise: string; /* Justificativa dada ao rejeitar ou aprovar um enunciado. */
    
    admitido: 0 | 1 | null;
    codigo: number | null;
}

interface Ocupacao {
    occupation_id: number,
    forum_id: number,
    occupation_name: string,
 }

 type FuncaoMembro = "PRESIDENTE" | "PRESIDENTA" | "RELATOR" | "RELATORA" | "MEMBRO" | "JURISTA" | "ESPECIALISTA" | "ASSESSORIA" | "PROGRAMADOR";

 interface Membro {
    id: number,
    nome: string,
    funcao: FuncaoMembro,
    proponente: number,
    comite: number,
    token: string,
 }

interface Proponente {
    attendee_id : number,
    forum_id : number,
    occupation_id : number,
    committee_id : number, 
    attendee_name : string,
    attendee_chosen_name : string,
    attendee_email : string,
    attendee_phone : string,
    attendee_document : string,
    attendee_affiliation : string,
    attendee_disability : string,
    attendee_acceptance_datetime : string,
    attendee_rejection_datetime : string,
} 

 interface Log {
	acao : string,
    detalhes: string,
    usuario : string,
    data: string
 }

 interface Votacao {
    votacao : number;
    justificativa : string;
    texto : string;
    comissao : string;
    votos : {
        id: number,
        nome: string, 
        voto: 0 | 1 | null
    }[];
}

interface Calendario {
    id : number,
	evento: "INSCRIÇÕES" | "HOMOLOGAÇÃO" | "VOTAÇÃO POR COMISSÃO" | "VOTAÇÃO GERAL",
    inicio: string,
    fim : string,
}