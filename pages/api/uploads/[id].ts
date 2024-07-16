import fs from 'fs';
import { apiHandler } from '../../../utils/apis';
import { ArquivoDAO } from '../../../db/arquivo';

async function download({res, req, db} : API){
    const { id } = req.query;

    const arquivo = await ArquivoDAO.listar(db, id as string);

    const stat = fs.statSync(arquivo.caminho)

    res.writeHead(200, {
        'Content-Type': arquivo.tipo,
        'content-length': stat.size,
        'Cache-Control': 'private,max-age=3600',
    })

    await new Promise((resolve, reject) => {
        setTimeout(resolve, 3000)
    })

    const stream = fs.createReadStream(arquivo.caminho);

    stream.pipe(res);
}


export default apiHandler({
    GET: download
})