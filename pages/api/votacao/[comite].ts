import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../utils/apis";
import mysql from "../../../utils/mysql";
import { carregarUsuario } from "../../../middleware";

async function validarPermissao(req: NextApiRequest, comite : number){
    const usuario = await carregarUsuario(req);

    const permissoes = await mysql.carregarPermissoes(usuario.matricula);

    const tem_permissao = permissoes.administrar_comissoes.some(e => e == comite);

    if(!tem_permissao)
        throw "Usuário sem permissão";
    
    return usuario;
}

async function listar(req: NextApiRequest, res: NextApiResponse){
    const {comite} = req.query

    const {matricula} = await validarPermissao(req, comite);
    
    const result = await mysql.carregarEnunciados({matricula, comite});
    res.send(result)
}

export default apiHandler({
    "GET" : listar,
}) 