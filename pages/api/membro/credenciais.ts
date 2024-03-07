import createHttpError from "http-errors";
import { apiHandler } from "../../../utils/apis";
import QRCode from "qrcode";
import MembroDAO from "../../../db/membro";
import archiver from "archiver";
import accents from 'remove-accents';

async function listar({res, db, usuario} : API){
    
    if(usuario?.funcao !== "ASSESSORIA" && usuario?.funcao !== "PROGRAMADOR")
        throw createHttpError.BadRequest(`${usuario?.funcao} não tem permissão para baixar as credenciais.`) ;

    const membros = await MembroDAO.listar(db, usuario);

    const arquivo = archiver("zip");

    const url = process.env.HOMOLOGACAO === "true" ? "https://jornada-hmg.trf2.jus.br" : "https://jornada.trf2.jus.br";

    for(let i = 0; i < membros.length; i++){
        const indice = (i + 1).toString().padStart(3, "0");
        const nome = accents.remove(membros[i].nome);

        const buffer = await QRCode.toBuffer(`${url}/comissao/login/${membros[i].token}`, {scale: 16});

        arquivo.append(buffer, {name : `${membros[i].comite} - ${nome}.png`})
    }
    

    await arquivo.finalize();

    res.setHeader('Content-disposition', 'attachment; filename=credenciais.zip');
    res.setHeader('Content-Type', 'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip');
    res.send(arquivo);
}

export default apiHandler({
    GET: listar
})