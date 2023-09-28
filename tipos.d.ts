
type AxiosInstance = import('axios').AxiosInstance;

interface Usuario {
    nome: string;
    matricula: string,
    lotacao: string,

    permissoes: {
        comissoes: number [],
        crud?: number
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