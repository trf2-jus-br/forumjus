import mailer from "../../utils/mailer"
import { apiHandler } from "../../utils/apis"
import Fetcher from '../../utils/fetcher'
import { registerSchema } from "../../utils/schema"
import createHttpError from "http-errors"
import ProponenteDAO from "../../db/proponente"
import EnunciadoDAO from "../../db/enunciado"
import OcupacaoDAO from "../../db/ocupacao"
import ComiteDAO from "../../db/comite"
import CalendarioDAO from "../../db/calendario"
import moment from "moment"

interface RequisicaoCadastro {
    privacyPolice: true,
    regimento: true,
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
    statement: {
        text: string,
        justification: string,
        committeeId: string, // '5' - deveria ser 'number'
    }[],
    attendeeAffiliation: string
 }

export const handler = async function ({req, res, db} : API) {
    const inscricoes = (await CalendarioDAO.listar(db)).find(c => c.evento === "INSCRIÇÕES");

    const aguardando = moment(inscricoes.inicio) > moment();
    const encerrada = moment(inscricoes.fim) < moment();

    if(aguardando || encerrada)
        throw createHttpError.BadRequest(`Inscrição negada! Verifique o cronograma.`);

    // Validar o Captcha
    const response_key = req.body.recaptchaToken;
    const secret_key = process.env.RECAPTCHA_SECRET_KEY;
    const options = {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
    }

    // Validate captcha
    const r = await Fetcher.fetcher(options.url)
    if (!r.success) 
        console.log(`Captcha inválido - DESABILITADO TEMPORARIAMENTE`)
        //throw createHttpError.BadRequest(`Captcha inválido`);

    // Validate registration data
    const data : RequisicaoCadastro = req.body.values
    
    const valid = await registerSchema.isValid(data)
    if (!valid) 
        throw createHttpError.BadRequest(`Dados inválidos`); 

    // Verfica se o usuário já existe
    const proponente = await ProponenteDAO.listarPorCPF_Email(db, data.attendeeDocument, data.attendeeEmail);

    if(proponente){
        const enunciados = await EnunciadoDAO.listarPorProponente(db, proponente.attendee_id);

        if(enunciados.length + data.statement.length > 3){
            //limite de 3 propostas.
            const numeroExtenso = (numero: number) => numero == 1 ? 'uma proposta' : `${numero == 2 ? 'duas' : 'três'} propostas`;

            throw `Solicitação não foi atendida, pois ultrapassaria o limite de propostas. Há ${numeroExtenso(enunciados.length)} registradas e solicitou a inclusão de mais ${numeroExtenso(data.statement.length)}.`;
        }
    }

    // Salva no banco de dados as informações do proponente e cada enunciado.
    const attendeeId = proponente?.attendee_id ?? await ProponenteDAO.criar(db, data);
    data.statement.forEach(async (statement) => await EnunciadoDAO.criar(db, statement, attendeeId))

    // Send email
    const ocupacoes = await OcupacaoDAO.listar(db);
    const comites = await ComiteDAO.listar(db);

    mailer.enviarConfirmacaoCadastros(data.attendeeEmail, data, db, ocupacoes, comites)

    res.send({ response: "Successful" });
}

export default apiHandler({
    'POST': handler
});