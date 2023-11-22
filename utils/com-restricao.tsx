import { usarContexto } from "../contexto";

function comRestricao(Pagina: React.ComponentType, ...autorizados : FuncaoMembro[]){
    return (props: any) => {
        const {usuario} = usarContexto();

        if(!usuario){
            return alert("Usuário deve estar autenticado para acessar essa página.")
        }

        if(autorizados.indexOf(usuario.funcao) !== -1){
            return alert(`${usuario.funcao} não tem permissão para acessar essa página.`);
        }
    
        return <Pagina {...props}/>;
    }
}

export default comRestricao;