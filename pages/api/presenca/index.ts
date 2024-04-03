import { apiHandler } from "../../../utils/apis";

async function entrada({db, req} : API){
    let { id, token } = req.body;

    if(token){
        const [membro] = await db.query('SELECT id FROM membro WHERE token = ?;', [token]);

        if(membro.length == 0)
            throw "Usuário não encontrado";

        id = membro[0].id;
    }

    const [resultado] = await db.query('SELECT * FROM presenca WHERE membro = ? AND saida IS NULL;', [id])

    if(resultado.length !== 0){
        throw "Registre a saída antes de registrar nova entrada."
    }

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

 async function listaPresentes({db} : API){
    const SQL = 
            `SELECT membro.* 
            FROM membro
            JOIN presenca ON membro.id = presenca.membro
            WHERE saida IS NULL;`
    const [resultado] = await db.query(SQL, []);
    
    return resultado;
 }

export default apiHandler({
    POST: entrada,
    DELETE: saida,
    GET: listaPresentes
})