import { apiHandler } from "../../../utils/apis";

async function entrada({db, req} : API){
    const { id } = req.body;
    await db.query('INSERT INTO presenca(membro) VALUES(?);', [id]);
}

async function saida({db, req} : API){
    const {id} = req.query;
    const SQL = `UPDATE presenca 
                JOIN (SELECT MAX(id) as id  FROM presenca WHERE membro = ?) ultimo
                SET saida = NOW()
                WHERE presenca.id = ultimo.id;`

    await db.query(SQL, [id])
}

export default apiHandler({
    POST: entrada,
    DELETE: saida
})