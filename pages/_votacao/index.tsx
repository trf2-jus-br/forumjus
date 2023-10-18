import { Button } from "react-bootstrap";
import Layout from "../../components/layout";
import Enunciado from "./enunciado";
import { useEffect, useState } from "react";
import { usarContexto } from "../../contexto";

function Votacao(){
    const { api } = usarContexto();
    const [enunciados, setEnunciados] = useState([]);
    const id = 0;


    useEffect(()=>{
        api.get('/api/admissao').then(({data})=> setEnunciados(data))
    }, [])



    return <Layout>
        <Button>Iniciar Votação</Button>

        {enunciados.length !== 0 && <Enunciado enunciado={enunciados[id]} filtro={0}  />}
    </Layout>
}

export default Votacao;