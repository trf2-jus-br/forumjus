export class RecursoDAO {
    static async listar(db: PoolConnection, funcao: FuncaoMembro) : Promise<{[key: string]: boolean}>{
        const [recursosPermitidos] = await db.query(
            `select recurso.nome, perfil.id from perfil_recurso
                join recurso on perfil_recurso.recurso = recurso.id
                join perfil on perfil_recurso.perfil = perfil.id
                join funcao_perfil on perfil.id = funcao_perfil.perfil
                where funcao_perfil.funcao = ?;`,
            [funcao]
        ) as any[];
    
        return recursosPermitidos.reduce( (acc, curr) => {
            acc[curr.nome] = true
            return acc;
        }, {});
    }


}