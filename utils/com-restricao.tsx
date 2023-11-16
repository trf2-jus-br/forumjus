import { usarContexto } from "../contexto";

function comRestricao(Pagina: React.ComponentType, ...autorizados : FuncaoMembro[]){
    return (props: any) => {
        const {usuario} = usarContexto();

        if(autorizados.indexOf(usuario.funcao) !== -1){
            return alert(`${usuario.funcao} não tem permissão para acessar essa página.`);
        }
    
        return <Pagina {...props}/>;
    }
}

export default comRestricao;