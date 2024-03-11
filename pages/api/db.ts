import createHttpError from "http-errors";
import { apiHandler } from "../../utils/apis";

async function manipulacao_perigosa_do_banco({req, res, db, usuario} : API){
    if(usuario?.funcao !== "PROGRAMADOR")
        throw createHttpError.BadRequest(`${usuario?.funcao} não tem permissão para acessar essa API.`);

    //if(process.env.HOMOLOGACAO !== "true"){
    //    throw createHttpError.BadRequest(`Essa api só pode ser utilizada em HOMOLOGAÇÃO.`);
    //}

    const { acao } = req.query;

    switch(acao){
        case "limparVotacao":
            await db.query("delete from voto where id >= 0;");
            await db.query("delete from votacao where id >= 0;");
            break;

        case "iniciarVotacaoPorComissao":
            await db.query("UPDATE calendario SET inicio = date_add(utc_timestamp(), interval -3 hour), fim = date_add(now(), interval 1 month) WHERE evento = 'VOTAÇÃO POR COMISSÃO';");
            await db.query("UPDATE calendario SET fim = date_add(utc_timestamp(), interval -3 hour) WHERE evento = 'VOTAÇÃO GERAL';");
            break;

        case "iniciarVotacaoGeral":
            await db.query("UPDATE calendario SET inicio = date_add(utc_timestamp(), interval -3 hour), fim = date_add(now(), interval 1 month) WHERE evento = 'VOTAÇÃO GERAL';");
            await db.query("UPDATE calendario SET fim = date_add(utc_timestamp(), interval -3 hour) WHERE evento = 'VOTAÇÃO POR COMISSÃO';");
            break;

        default:
            throw createHttpError.BadGateway(`Ação '${acao}' não definida.`);
    }

    res.send(null);
}

export default apiHandler({
    "POST": manipulacao_perigosa_do_banco
})