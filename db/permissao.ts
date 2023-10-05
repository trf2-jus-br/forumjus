
/*
    Classe tem como objetivo carregar as permissões do usuário, utilizando a sua matricula.
 */
class PermissaoDAO{
    static async carregar(db: PoolConnection, usuario : Usuario | UsuarioSiga) : Promise<Usuario['permissoes']>{
        const documento = "titularSigla" in usuario ? usuario.titularSigla : usuario.matricula;

        const [result ] = await db.query( 
            `select administrar_comissoes, votar_comissoes, crud, estatistica 
            from permissao where JSON_CONTAINS(usuarios, ?, '$');`, [`"${documento}"`])

        return {
            administrar_comissoes: JSON.parse(result[0]?.administrar_comissoes || '[]'),
            votar_comissoes: JSON.parse(result[0]?.votar_comissoes || '[]'),
            crud: result[0]?.crud === 1,
            estatistica: result[0]?.estatistica === 1,
        }
    }
}

export default PermissaoDAO;