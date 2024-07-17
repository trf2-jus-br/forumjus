import nodemailer from 'nodemailer'; 
import fs from "fs/promises";

import EmailConfirmacaoCadastro from './template-email/confirmacao-cadastro'
import EmailNotificarAdmissao from "./template-email/notificar-admissao";
import EmailNotificarRejeicao from "./template-email/notificar-rejeicao";
import EmailNotificarDivergencia from './template-email/notificar-divergencia';
import { ArquivoDAO } from '../db/arquivo';

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

    from: process.env.SMTP_FROM,

    send(message) {
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

    footer(electionId) {
        return `

Obrigado por utilizar o Votejus.

---
VOTEJUS-${electionId}`
    },

    sendCreated(email, electionId, electionName, administratorLink) {
        this.send({
            from: this.from,
            to: email,
            subject: `${electionName}: Criada`,
            text: `A votação "${electionName}" foi criada com sucesso.
    
Utilize o link abaixo para iniciar a votação e acompanhar os resultados.

${administratorLink}

Atenção:

- Os eleitores só reberão um link por e-mail para votar quando a votação for iniciada.

- Não compartilhe este link pois só o administrados da votação deve ter acesso ao link.

- Não apague esse email pois sem o link acima não será possível acessar o painel de votação.` + this.footer(electionId)
        })
    },

    sendVoteRequest(email, electionId, electionName, voterName, voterLink) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Voto Solicitado`,
            text: `Prezado(a) ${voterName},

A votação "${electionName}" foi iniciada.

Utilize o link abaixo para votar sigilosamente:

${voterLink}

Atenção: 

- Não compartilhe este link para que ninguém possa votar em seu nome.

- Não apague esse email pois sem o link acima não será possível votar.

- Depois de votar, não será possível trocar o voto.` + this.footer(electionId)
        })
    },

    sendVoteAccepted(email, electionId, electionName, voterName, voterIp) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Voto Registrado`,
            text: `Prezado(a) ${voterName},

Seu voto sigiloso foi registrado para a eleição "${electionName}".` + this.footer(electionId)
        })
    },

    sendElectionEnded(email, electionId, electionName, voterName) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Eleição Finalizada`,
            text: `Prezado(a) ${voterName},

A votação "${electionName}" foi encerrada.` + this.footer(electionId)
        })
    },

    forumFooter(forumName) {
        return `

Atenciosamente,

Equipe ${forumName}.`
    },

    async notificarProponente(db: PoolConnection, email: string, enunciados: any[], enunciados_reprovados: any[], nome: string){
        try{
            const {ambiente} = db;
            
            const admitido = enunciados.length !== 0 && enunciados.every(e => e.committee_id === enunciados[0].committee_id); 
            const rejeitado = enunciados.length === 0; 

            
            const bufferSaia = await fs.readFile( 
                (await ArquivoDAO.listar(db,ambiente.BANNER)).caminho
            )

            const bufferRegulamento = await fs.readFile(
                (await ArquivoDAO.listar(db, ambiente.REGULAMENTO)).caminho    
            )

            let anexos = [{
                filename: 'image.png',
                content: bufferSaia.toString("base64"),
                cid: 'imagem',
                encoding: 'base64'
            }];

            if(admitido){
                anexos.push({
                    filename: 'regulamento.pdf',
                    content: bufferRegulamento
                });
            }

            this.send({
                from: this.from,
                to: email.trim(),
                cc: process.env.SMTP_BCC === 'false' ? undefined : ambiente.EMAIL_ORGANIZACAO,
                subject: `${ambiente.NOME}`,
                html: admitido ? EmailNotificarAdmissao(ambiente, enunciados, nome) : rejeitado ? EmailNotificarRejeicao(ambiente, enunciados_reprovados, nome) : EmailNotificarDivergencia(ambiente, enunciados, nome),
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
            from: this.from,
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
