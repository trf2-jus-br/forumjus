import { usarContexto } from "../contexto";

function comPermissao(Pagina: React.ComponentType, ...autorizados : FuncaoMembro[]){
    return () => {
        const {usuario} = usarContexto();

        if(!usuario){
            return alert("Usuário deve estar autenticado para acessar essa página.")
        }

        if(autorizados.indexOf(usuario.funcao) === -1){
            return alert(`${usuario.funcao} não tem permissão para acessar essa página.`);
        }
    
        return <Pagina />;
    }
}

export default comPermissao;