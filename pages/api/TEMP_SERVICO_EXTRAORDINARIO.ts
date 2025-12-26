import { apiHandler } from "../../utils/apis";

async function GET({req, res, db, usuario} : API){
    const {id, recurso} = req.query;

    const recursos = {
        autor: {
            sql : "SELECT * FROM TEMP_SERVICO_EXTRAORDINARIO_USUARIO WHERE ISNULL(?) OR id_autor = ?;",
            params : [id, id]
        },
        comunidade_quilombola: {
            sql : "SELECT * FROM TEMP_SERVICO_EXTRAORDINARIO_QUILOMBOLA WHERE ISNULL(?) OR id = ?;",
            params : [id, id]
        },
        povo_indigena: {
            sql : "SELECT * FROM TEMP_SERVICO_EXTRAORDINARIO_POVO WHERE ISNULL(?) OR id_povo = ?;",
            params : [id, id]
        }
    }
    
    if(recurso == null || typeof recurso == "object")
        throw "parâmetro 'recurso' deve ser informado.";

    const consulta = recursos[recurso];

    if(consulta == null)
        throw "parâmetro 'recurso' inválido.";

    const [result] = await db.query(consulta.sql, consulta.params);
    
    // CORS headers
    configurar_CORS(res);
    res.send(result);
    
}


async function POST({req, res, db, usuario} : API){
    try{
        const {
            id_autor, raca_etnia, familia_linguistica, povo, comunidade_quilombola
        } = req.body;

        await db.query("INSERT INTO TEMP_SERVICO_EXTRAORDINARIO_LOG (body, headers) VALUES(?, ?);", [ JSON.stringify(req.body), JSON.stringify(req.headers) ]);

        const consulta_autor: any = await db.query("SELECT * FROM TEMP_SERVICO_EXTRAORDINARIO_USUARIO WHERE id_autor = ?", [id_autor]);

        if(consulta_autor[0][0]){
            await db.query("UPDATE TEMP_SERVICO_EXTRAORDINARIO_USUARIO SET raca_etnia = ?, familia_linguistica = ?, povo = ?, comunidade_quilombola = ? WHERE id_autor = ?",
                [raca_etnia, familia_linguistica, povo, comunidade_quilombola, id_autor]
            );
        }else{
            await db.query("INSERT INTO TEMP_SERVICO_EXTRAORDINARIO_USUARIO (id_autor, raca_etnia, familia_linguistica, povo, comunidade_quilombola) VALUES (?, ?, ?, ?, ?);", 
                [id_autor, raca_etnia, familia_linguistica, povo, comunidade_quilombola]
            )
        }

        // CORS headers
        configurar_CORS(res);
        res.send(null);
    }catch(err){
        console.log(err);

        // CORS headers
        configurar_CORS(res);
        res.status(500).send(err);
    }
}

function configurar_CORS(res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Credentials', "true")
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
}

//CORS: preflight request
async function OPTIONS({req, res, db, usuario} : API){
    configurar_CORS(res);
    res.send(null);
}

export default apiHandler({
    "GET": GET,
    "POST": POST,
    "OPTIONS": OPTIONS
})