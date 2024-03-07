import createHttpError from "http-errors"
import mailer from "../utils/mailer";

const forumId = 1;

interface RequisicaoCadastro {
    attendeeName: string,
    attendeeChosenName: string,
    attendeeEmail: string,
    attendeeEmailConfirmation: string,
    attendeePhone: string,
    attendeeDocument: "",
    attendeeOccupationId: string, //'6' - deveria ser 'number'.
    attendeeOccupationOther: "",
    attendeeOccupationAffiliation: "",
    attendeeDisabilityYN: string, //'true' - deveria ser 'boolean'
    attendeeDisability: string,
    attendeeAffiliation: string
 }

 interface Proponente {
    attendee_id: number,
    nome : string,
    email : string,
    admitido : 0 | 1,
    committee_name : string
    committee_id: number,
    statement_text: string
}

class ProponenteDAO{
    static async criar(db: PoolConnection, data: RequisicaoCadastro){
        // Verifica se o usuário já existe no banco de dados.
        const resultEmail = await db.query('SELECT * FROM attendee WHERE attendee_email = ?;', [data.attendeeEmail])
        
        // Notifica o usuário se o e-mail já existe.
        if (resultEmail[0].length) 
            throw createHttpError.BadRequest(`E-mail ${data.attendeeEmail} já consta na base de inscritos`); 
    
        // Antes de inserir no banco, garante que se nenhum 'Nome Social' for informado será gravado NULL.
        if (data.attendeeChosenName) {
            data.attendeeChosenName = data.attendeeChosenName.trim()
            
            if (data.attendeeChosenName === '') 
                delete data.attendeeChosenName
        }

        // Insere os dados no banco.
        const [result] = await db.query(
                `INSERT INTO attendee (
                    forum_id,occupation_id,attendee_name,attendee_chosen_name,
                    attendee_email,attendee_phone,attendee_document,
                    attendee_affiliation,attendee_disability
                ) 
                VALUES (
                    ?,?,?,?,
                    ?,?,?,
                    ?,?
                );`
            ,[ 
                forumId,  data.attendeeOccupationId, data.attendeeName, data.attendeeChosenName, 
                data.attendeeEmail, data.attendeePhone, data.attendeeDocument, 
                data.attendeeAffiliation, data.attendeeDisability
            ]
        );
        
        // Retorno o futuro id do proponente, que será utilizado como chave estrangeira do enunciado.
        return result.insertId
    }

    static async listarPorId(db: PoolConnection, id: number){
        const [proponentes] = await db.query('SELECT * FROM attendee where attendee_id = ?;', [id]);
        return proponentes[0] as Proponente;
    }

    static async listar(db: PoolConnection, usuario: Usuario){
        if(usuario.funcao !== "ASSESSORIA" && usuario.funcao !== "PROGRAMADOR")
            throw createHttpError.BadRequest(`${usuario.funcao} não tem permissão para acessar a listagem de proponentes.`);

        const [resultado] = await db.query(
            `SELECT 
                attendee.attendee_id,
                attendee_name as nome,
                attendee_email as email,
                admitido,
                committee_name,
                committee.committee_id,
                statement.statement_text
            FROM attendee
            LEFT JOIN statement ON statement.attendee_id = attendee.attendee_id
            LEFT JOIN committee ON statement.committee_id = committee.committee_id;`)

        return resultado as Proponente[];
    }

    static async notificar(db: PoolConnection, usuario: Usuario){
        // verifica as credênciais
        if(usuario.funcao !== "ASSESSORIA" && usuario.funcao !== "PROGRAMADOR")
            throw createHttpError.BadRequest(`${usuario.funcao} não tem permissão para acessar a listagem de proponentes.`);

        // lista todos os enunciados, com as informações do proponente do dado enunciado.
        const proponentes = await ProponenteDAO.listar(db, usuario);

        // agrupa todos os enunciados do mesmo proponente.
        const proponentes_resumidos = proponentes.reduce((prev, curr) => {
            if(!prev[curr.attendee_id]){
                prev[curr.attendee_id] = {
                    attendee_id: curr.attendee_id,
                    nome: curr.nome,
                    email: curr.email,
                    enunciados: [],
                    enunciados_reprovados: []
                }
            }

            // separa os enunciados admitidos dos rejeitados.
            if(curr.admitido){
                prev[curr.attendee_id].enunciados.push({
                    committee_name: curr.committee_name,
                    committee_id: curr.committee_id,
                    statement_text: curr.statement_text
                })
            }else{
                prev[curr.attendee_id].enunciados_reprovados.push({
                    committee_name: curr.committee_name,
                    committee_id: curr.committee_id,
                    statement_text: curr.statement_text
                })
            }

            return prev;
        }, {});
        
        const listagem = Object.values(proponentes_resumidos);

        // Por diversas razoes os administradores podem não notificar alguns e-mail.
        const emails_bloqueados = [];

        for(let i = 0; i < listagem.length; i++){
            if(emails_bloqueados.indexOf(listagem[i].email.trim()) === -1){
                await mailer.notificarProponente(listagem[i].email, listagem[i].enunciados, listagem[i].enunciados_reprovados, `${listagem[i].nome}<br/>${listagem[i].email}`);
            }
        }
    }
}

export default ProponenteDAO;