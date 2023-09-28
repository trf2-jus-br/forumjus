import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"
import validate from '../../utils/validate'
import Fetcher from '../../utils/fetcher'
import { registerSchema } from "../../utils/schema"

// const request = promisify(require('request'));

//todo: validar corretamente todos os campos


const handler = async function (req, res) {
    // Validar o Captcha
    const response_key = req.body.recaptchaToken;
    const secret_key = process.env.RECAPTCHA_SECRET_KEY;
    const options = {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
    }
    try {

        // Validate captcha
        const r = await Fetcher.fetcher(options.url)
        if (!r.success) throw `Captcha inválido`

        // Validate registration data
        const data = req.body.values
        const valid = await registerSchema.isValid(data)
        if (!valid) throw `Dados inválidos`

        const forumId = 1

        // Add to the database
        await mysql.register(forumId, data)

        // Send email
        const forumContants = await mysql.loadForumConstants(forumId)
        mailer.enviarConfirmacaoCadastros(data.attendeeEmail, forumContants, data)

        return res.send({ response: "Successful" });
    } catch (error) {
        console.log(error)
        return res.status(400).send({ response: error });
    }
}

export default apiHandler({
    'POST': handler
});