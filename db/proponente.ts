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
    nome : string,
    email : string,
    admitido : 0 | 1,
    committee_name : string
    committee_id: number,
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
                committee.committee_id
            FROM attendee
            LEFT JOIN statement ON statement.attendee_id = attendee.attendee_id
            LEFT JOIN committee ON statement.committee_id = committee.committee_id;`)

        return resultado as Proponente[];
    }

    static async notificar(db: PoolConnection, usuario: Usuario){
        if(usuario.funcao !== "ASSESSORIA" && usuario.funcao !== "PROGRAMADOR")
            throw createHttpError.BadRequest(`${usuario.funcao} não tem permissão para acessar a listagem de proponentes.`);

        const proponentes = await ProponenteDAO.listar(db, usuario);

        proponentes.forEach( e => mailer.notificarProponente(e.email, e.admitido));
    }
}

export default ProponenteDAO;