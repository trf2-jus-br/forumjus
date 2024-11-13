import nodemailer from 'nodemailer'; 
import fs from "fs/promises";

import EmailConfirmacaoCadastro from './template-email/confirmacao-cadastro'
import EmailNotificarAdmissao from "./template-email/notificar-admissao";
import EmailNotificarRejeicao from "./template-email/notificar-rejeicao";
import EmailNotificarDivergencia from './template-email/notificar-divergencia';
import { ArquivoDAO } from '../db/arquivo';

import type { MailOptions } from 'nodemailer/lib/json-transport';
import Mail from 'nodemailer/lib/mailer';

type ComissaoCaderno = {
    [key: string] : string
};

const options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secureConnection: false, // TLS requires secureConnection to be false
    secure: false,
    ignoreTLS: true,
    tls: {
        rejectUnauthorized: false
    }
}

export default {
    mailer: nodemailer,

    transporter: nodemailer.createTransport(options),

    send(message : Mail.Options) {
        return new Promise((resolve, reject)=>{
            this.transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(null);
                }
            })
        });
    },

    async notificarProponente(db: PoolConnection, email: string, cadernos: ComissaoCaderno, enunciados: any[], enunciados_reprovados: any[], nome: string){
        try{
            const {ambiente} = db;
            
            const admitidoExatamenteUmaComissao = enunciados.length !== 0 && enunciados.every(e => e.committee_id === enunciados[0].committee_id); 
            const rejeitado = enunciados.length === 0; 

            let bufferSaia, bufferRegulamento;

            try{
                bufferSaia = await fs.readFile( 
                    (await ArquivoDAO.listar(db,ambiente.BANNER)).caminho
                )
            }catch(err){
                throw "Não foi possível carregar o 'Banner'."
            }
            

            try{
                bufferRegulamento = await fs.readFile(
                    (await ArquivoDAO.listar(db, ambiente.REGULAMENTO)).caminho    
                )
            }catch(err){
                throw "Não foi possível carregar o 'REGULAMENTO'."
            }


            let anexos : Mail.Attachment[] = [{
                filename: 'image.png',
                content: bufferSaia.toString("base64"),
                cid: 'imagem',
                encoding: 'base64'
            }];

            // REGRA: só envia anexos para os proponentes admitidos.
            if(!rejeitado){
                anexos.push({
                    filename: 'regimento.pdf',
                    content: bufferRegulamento
                });
            }

            // REGRA: só anexa o caderno, caso o proponente tenha sido admitido em exatamente uma comissão.
            if(admitidoExatamenteUmaComissao){
                try{
                    // obtém o uuid do pdf, baseado na comissão.
                    const uuid = cadernos[ enunciados[0].committee_id ];

                    // busca no banco de dados, o caminho do pdf
                    const arquivo = await ArquivoDAO.listar(db, uuid);

                    // carrega o pdf.
                    const bufferCaderno = await fs.readFile(arquivo.caminho);

                    // adiciona a lista de anexos.
                    anexos.push({
                        filename: 'caderno.pdf',
                        content: bufferCaderno
                    });
                }catch(err){
                    throw "Não foi possível carregar o 'Caderno'."
                }
            }

            this.send({
                from: ambiente.EMAIL_ORGANIZACAO,
                to: email.trim(),
                cc: process.env.SMTP_BCC === 'false' ? undefined : ambiente.EMAIL_ORGANIZACAO,
                subject: `${ambiente.NOME}`,
                html: admitidoExatamenteUmaComissao ? EmailNotificarAdmissao(ambiente, enunciados, nome) : rejeitado ? EmailNotificarRejeicao(ambiente, enunciados_reprovados, nome) : EmailNotificarDivergencia(ambiente, enunciados, nome),
                attachments: anexos
            });
        }catch(err){
            throw err;
        }
    },

    async enviarConfirmacaoCadastros(email, data, db: PoolConnection, ocupacoes: Ocupacao[], comites: Comite[]) {
        const { ambiente } = db;
        
        const content = await fs.readFile(
            (await ArquivoDAO.listar(db, ambiente.BANNER)).caminho
        );
        
        this.send({
            from: ambiente.EMAIL_ORGANIZACAO,
            to: email.trim(),
            cc: process.env.SMTP_BCC === 'false' ? undefined : ambiente.EMAIL_ORGANIZACAO,
            subject: `${ambiente.NOME}`,
            html: EmailConfirmacaoCadastro(data, ambiente, ocupacoes, comites),
            attachments: [{
                filename: 'image.png',
                content: content.toString("base64"),
                cid: 'imagem',
                encoding: 'base64'
            }]
        })
    },

}
