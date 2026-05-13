import fs from 'fs';
import { apiHandler } from '../../../utils/apis';
import { ArquivoDAO } from '../../../db/arquivo';

async function download({res, req, db} : API){
    const { id } = req.query;

    const arquivo = await ArquivoDAO.listar(db, id as string);

    if (!arquivo) {
        console.log(`Arquivo ${id} não encontrado no banco de dados.`);
        return; 
    }

    const stat = fs.statSync(arquivo.caminho)

    res.writeHead(200, {
        'Content-Type': arquivo.tipo,
        'content-length': stat.size,
        'Cache-Control': 'public,max-age=360000',
    })
 
    const stream = fs.createReadStream(arquivo.caminho);

    stream.pipe(res);
}


export default apiHandler({
    GET: download
})