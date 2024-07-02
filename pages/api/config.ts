import { apiHandler } from "../../utils/apis";

async function listar({db} : API){
    const [config] = await db.query("SELECT * FROM configuracao");
    return config;
}

async function getConfig(){

}

export default apiHandler({
    GET: listar
})