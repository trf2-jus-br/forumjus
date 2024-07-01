require('dotenv').config({})

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

async function inicializar(){
    const jornadas = await carregarJornadas();
    
    const dataSouceOption: MysqlConnectionOptions = {
        type: "mysql",
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        username: process.env.FORUMJUS_SVC_DBUSER,
        password: process.env.FORUMJUS_SVC_DBPWD,
        database: process.env.MYSQL_DATABASE,
        migrations: await carregarMigracoes(),
        migrationsRun: false,
        migrationsTransactionMode: "all"
    };

    for(let i = 0; i < jornadas.length; i++){
        console.log(`Migrando '${jornadas[i].nome}'...`)
        
        const dt = new DataSource({ ...dataSouceOption, database: jornadas[i].esquema})
        await dt.initialize();
        await dt.runMigrations();
    }

    console.log('\nMigrações finalizadas.\n')
    process.exit()
}

inicializar();