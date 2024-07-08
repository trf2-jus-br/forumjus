require('dotenv').config({})
const nodemailer = require('nodemailer');

import * as fs  from 'fs/promises';

import { DataSource } from "typeorm"
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { carregarJornadas } from "./esquemas";

async function carregarMigracoes(){
    const arquivos = await fs.readdir( __dirname + '/migration');

    const classes = arquivos.map(a => {
        const modulo = require(`${__dirname}/migration/${a}`);
        const nomeClasse = Object.keys(modulo)[0];

        return modulo[nomeClasse];
    })

    return classes;
}

async function notificarErro(err : Error){
    console.log(err);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secureConnection: false, // TLS requires secureConnection to be false
        secure: false,
        ignoreTLS: true,
        tls: {
            rejectUnauthorized: false
        }
    });

    return new Promise((resolve, reject) => {
        const config = {
            from: 'walace.pereira@trf2.jus.br',
            to: 'walace.pereira@trf2.jus.br',
            subject: `Migração ForumJus`,
            text: err.stack
        }
    
        transporter.sendMail(config, (err, info) => {
            if (err) {
                console.log("erro ao enviar email", err)
                reject(err);
            } else {
                resolve(null);
            }
        })
    });
}

async function inicializar(){
    // define se deve executar ou reverte as migrações.
    const reverter = process.argv.indexOf('--revert') !== -1;

    const jornadas = await carregarJornadas();
    
    const dataSouceOption: MysqlConnectionOptions = {
        type: "mysql",
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        username: process.env.MYSQL_SVC_USER,
        password: process.env.MYSQL_SCV_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        migrations: await carregarMigracoes(),
        migrationsRun: false,
        migrationsTransactionMode: "all"
    };

    for(let i = 0; i < jornadas.length; i++){
        try{
            const dt = new DataSource({ ...dataSouceOption, database: jornadas[i].esquema})
            await dt.initialize();
                
            if(reverter){
                console.log(`Revertendo '${jornadas[i].nome}'...`)
                await dt.undoLastMigration();
            }else{
                console.log(`Migrando '${jornadas[i].nome}'...`)

                // A migração será temporariamente fake para que a tabela 'Migrations' seja criada no esquema preexistente.
                await dt.runMigrations({fake: true});
            }
        }catch(err){
            // Migra o que for possível, notifica notifica os erros.
           await notificarErro(err);
        }
    }

    process.exit()
}

inicializar();