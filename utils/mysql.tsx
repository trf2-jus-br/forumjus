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
      
    async votar({db, matricula, statement_id, committee_id, contra}){
        const permissao = await PermissaoDAO.carregar(db, usuario);

        if(permissao.administrar_comissoes.indexOf(committee_id) === -1){
            throw "Usuário sem permissão para votar."
        }

        const voto = contra ? 'statement_acceptance' : ' statement_rejection';

        await db.query( 
            `UPDATE statement SET ${voto} = ${voto} + 1 WHERE statement_id = ? and committee_id = ?;`,
            [statement_id, committee_id]
        );
    },
}