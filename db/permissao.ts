import createHttpError from "http-errors";

/*
    Classe tem como objetivo carregar as permissões do usuário, utilizando a sua matricula.
 */
class PermissaoDAO{
    static async carregar(db: PoolConnection, usuario : Usuario) : Promise<Usuario['permissoes']>{
        if(usuario == null){
            throw createHttpError(403, "Usuário nulo ao validar as permissões.")
        }

        // decidimos só atualizar as permissões no login.
        // razão: É incomum atualizar as permissões e isso acarretaria em uma atraso 'desnecessário' na maioria dos casos.
        return usuario.permissoes;
    }
}

export default PermissaoDAO;