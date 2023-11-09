import { usarContexto } from "../contexto";

function comRestricao(Pagina: React.ComponentType, ...autorizados : FuncaoMembro[]){
    return () => {
        const {usuario} = usarContexto();

        if(autorizados.indexOf(usuario.funcao) !== -1){
            return alert(`${usuario.funcao} não tem permissão para acessar essa página.`);
        }
    
        return <Pagina />;
    }
}

export default comRestricao;