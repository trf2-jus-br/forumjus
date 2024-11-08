import createHttpError from "http-errors";
import { apiHandler } from "../../../utils/apis";
import QRCode from "qrcode";
import MembroDAO from "../../../db/membro";
import archiver from "archiver";
import accents from 'remove-accents';

async function listar({req, res, db, usuario} : API){
    
    if(usuario?.funcao !== "ASSESSORIA" && usuario?.funcao !== "PROGRAMADOR")
        throw createHttpError.BadRequest(`${usuario?.funcao} não tem permissão para baixar as credenciais.`) ;

    const membros = await MembroDAO.listar(db, usuario);

    const arquivo = archiver("zip");


    const https = req.headers["x-forwarded-scheme"]; // "https",
    const forwarded_host = req.headers["x-forwarded-host"]; // "jornada-hmg.trf2.jus.br",
    const host = req.headers["host"];

    const url = forwarded_host ? `${https}://${forwarded_host}` : host;

    for(let i = 0; i < membros.length; i++){
        const indice = (i + 1).toString().padStart(3, "0");
        const nome = accents.remove(membros[i].nome);

        const buffer = await QRCode.toBuffer(`${url}/comissao/login/${membros[i].token}`, {scale: 16});

        arquivo.append(buffer, {name : `${membros[i].comite || "#"} - ${nome}.png`})
    }
    

    await arquivo.finalize();

    res.setHeader('Content-disposition', 'attachment; filename=credenciais.zip');
    res.setHeader('Content-Type', 'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip');
    res.send(arquivo);
}

export default apiHandler({
    GET: listar
})