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

export default {
    async getConnection() {
        return await pool.getConnection();
    },
}