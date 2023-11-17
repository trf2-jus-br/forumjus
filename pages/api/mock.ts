import { apiHandler } from "../../utils/apis";
import { faker} from '@faker-js/faker';
import { handler } from "./register"; 
import createHttpError from "http-errors";

async function criarUsuario({db, usuario} : API){
    if(usuario?.funcao !== "PROGRAMADOR")
        throw createHttpError.Forbidden(`'${usuario?.funcao}' não tem permissão para criar mocks`);

    const tick = new Date().getTime();

    const mockReq = {
        body : {
            "recaptchaToken": "",  
            "values": {
               "privacyPolice": true,
               "regimento": true,
               "attendeeName":  faker.person.fullName(),
               "attendeeChosenName": "",
               "attendeeEmail": `walace.pereira+${tick}@trf2.jus.br`,
               "attendeeEmailConfirmation": `walace.pereira+${tick}@trf2.jus.br`,
               "attendeePhone": "(21) 9876-5432",
               "attendeeDocument": "",
               "attendeeOccupationId": faker.number.int({min: 1, max: 6}),
               "attendeeOccupationOther": "",
               "attendeeOccupationAffiliation": "",
               "attendeeDisabilityYN": false,
               "attendeeDisability": "",
               "statement": [
                  {
                     "text": faker.lorem.sentences({min: 1, max: 3}),
                     "justification": faker.lorem.sentences({min: 6, max: 10}),
                     "committeeId": faker.number.int({min: 1, max: 7})
                  }
               ],
               "attendeeAffiliation": "TRF2 - Técnico Judiciário"
            }
         }
    }

    const mockRes = {
        send: (obj) => console.log(obj)
    }

    await handler({
        req: mockReq, 
        res: mockRes, 
        db
    });
}


async function mock({res, db} : API){
    for(let i = 0; i < 100; i++){
        await criarUsuario({db});
    }

    res.send(200);
}

export default apiHandler({
    GET: mock
})