import { randomUUID } from "crypto";
import formidable, { IncomingForm } from "formidable";
import fs, { constants } from "fs/promises";
import { NextApiRequest } from "next";
import path from "path";
import os from 'os';

export class ArquivoDAO {
    // processa requisições 'multipart/form-data' e caso exista salva o arquivo.
    static async processar(db: PoolConnection, req: NextApiRequest, nomeArquivo?: string) : Promise<[formidable.Fields<string>, string]>{
        const uuid = randomUUID().toString();
        const dev = process.env.NODE_ENV === "development";
        const homedir =  dev ? os.tmpdir() : '/dados/jornada';
        const uploadDir = path.join(homedir, uuid);

        try{
            await fs.access(uploadDir, constants.F_OK);
        }catch(err){
            await fs.mkdir(uploadDir, {recursive: true})
        }

        const form = new IncomingForm({multiples: false, uploadDir, filename: (name, ext, part, form) => part.originalFilename});

        const [campos, arquivos] = await form.parse(req);

        // Considera que a requisição contém apenas um arquivo.
        const arquivo = arquivos[nomeArquivo || 'valor']?.at(0)

        if(!arquivo){
            return [campos, undefined];
        }

        await db.query('INSERT INTO arquivo (id, caminho, tipo ) VALUES ( ?, ?, ?);', [uuid, arquivo.filepath, arquivo.mimetype])

        return [campos, uuid];
    }


    static async listar(db: PoolConnection, id: string) : Promise<Arquivo>{
        const [resultados] = await db.query('SELECT id, caminho, tipo FROM arquivo WHERE id = ?;', [id]);

        return resultados[0] as Arquivo;
    }
}