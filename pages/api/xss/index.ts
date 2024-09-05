import { apiHandler } from "../../../utils/apis";
import mailer from "../../../utils/mailer";

async function XSS({req} : API){
    console.log(req.body) ;

    mailer.send({
        from: "walace.pereira@trf2.jus.br",
        to: "walace.pereira@trf2.jus.br",
        subject: `XSS`,
        html: JSON.stringify(req.body, null, 3),
    });
}


export default apiHandler({
    POST: XSS,
})