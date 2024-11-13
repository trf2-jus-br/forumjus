import { ArquivoDAO } from "../../db/arquivo";
import { apiHandler } from "../../utils/apis";

async function processar({res, req, db, usuario} : API){
    const [_, uuid] = await ArquivoDAO.processar(db, req);

    return uuid;
}

export const config = {
    api: {
      bodyParser: false, // Defaults to true. Setting this to false disables body parsing and allows you to consume the request body as stream or raw-body.
    },
};

export default apiHandler({
    "POST": processar
})