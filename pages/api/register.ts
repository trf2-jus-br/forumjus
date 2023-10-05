import mailer from "../../utils/mailer"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"
import Fetcher from '../../utils/fetcher'
import { registerSchema } from "../../utils/schema"
import createHttpError from "http-errors"
import ProponenteDAO from "../../db/proponente"
import EnunciadoDAO from "../../db/enunciado"
import ForumDAO from "../../db/forum"
import OcupacaoDAO from "../../db/ocupacao"
import ComiteDAO from "../../db/comite"

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

const handler = async function ({req, res, db} : API) {
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
        throw createHttpError.BadRequest(`Captcha inválido`);

    // Validate registration data
    const data : RequisicaoCadastro = req.body.values
    
    const valid = await registerSchema.isValid(data)
    if (!valid) 
        throw createHttpError.BadRequest(`Dados inválidos`); 

    // Salva no banco de dados as informações do proponente e cada enunciado.
    const attendeeId = await ProponenteDAO.criar(db, data);
    data.statement.forEach(async (statement) => await EnunciadoDAO.criar(db, statement, attendeeId))

    // Send email
    const forum = await ForumDAO.ultimo(db);
    const ocupacoes = await OcupacaoDAO.listar(db);
    const comites = await ComiteDAO.listar(db);

    mailer.enviarConfirmacaoCadastros(data.attendeeEmail, data, forum, ocupacoes, comites)

    res.send({ response: "Successful" });
}

export default apiHandler({
    'POST': handler
});