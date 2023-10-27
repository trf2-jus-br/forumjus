import mysql from "mysql2/promise";
import PermissaoDAO from "../db/permissao";

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
});

/*
pool.on("acquire", (con) => console.log(`acquire ${con.threadId}`));
pool.on("connection", (con) => console.log(`connection ${con.threadId}`, ));
pool.on("enqueue", () => console.log('enqueue'));
pool.on("release", (con) => console.log(`release ${con.threadId}`));
*/

export default {
    async getConnection() {
        return await pool.getConnection();
    },
}