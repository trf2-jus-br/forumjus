import { apiHandler } from "../../utils/apis";

async function listar({db} : API) : Promise<Ambiente>{
    return db.ambiente;
}

export default apiHandler({
    GET: listar
})