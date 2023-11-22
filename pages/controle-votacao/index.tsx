import React, {useEffect, useState} from "react";
import { Breadcrumb, Form } from "react-bootstrap";
import Layout from "../../components/layout";
import { usarContexto } from "../../contexto";
import Enunciado from "./enunciado";
import comPermissao from "../../utils/com-permissao";
import { retornoAPI } from "../../utils/api-retorno";

type EnunciadoVotacao = Enunciado & {
    votacao_inicio: string,
    votacao_fim: string,
}

function ControleVotacao(){
    const [comites, setComites] = useState<Comite[]>();
    const [enunciados, setEnunciados] = useState<EnunciadoVotacao[]>([]);
    const [filtro, setFiltro] = useState<number>(null)

    const { api, exibirNotificacao } = usarContexto();


    async function carregarComissoes(){
        try{
            const { data : comites } = await api.get<Comite[]>('/api/comite');
            setComites(comites)
        }catch(err){
            // Avise sobre o erro.
            exibirNotificacao({
                titulo: "Nãoo foi possível carregar as comissões.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })

            // tenta recarregar as comissões.
            setTimeout(carregarComissoes, 1000);
        }
    }

    async function carregar(){
        try{
            const {data} = await api.get<EnunciadoVotacao[]>(`/api/enunciado/votacao`);
            setEnunciados(data);
        }catch(err){
             // Avise sobre o erro.
             const texto = retornoAPI(err);

             exibirNotificacao({
                titulo: "Nãoo foi possível carregar os enunciados.",
                texto,
                tipo: "ERRO"
            })

             if(texto !== "Aguarde até a data da votação."){
                // tenta recarregar as comissões.
                setTimeout(carregar, 1000);
             }
                
        }
    }

    useEffect(()=>{
        carregar();
        carregarComissoes();
    }, [])


    return <Layout>
        <div className='d-flex align-items-start justify-content-between'>
            <Breadcrumb>
                <Breadcrumb.Item active>Controle da votação</Breadcrumb.Item>
            </Breadcrumb>

            <Form.Select size="sm" value={filtro} style={{width: '50%'}} onChange={(e)=> setFiltro(parseInt(e.target.value) || null)}>
                <option value={null}>TODOS</option>
                {comites?.map( (c, i) => <option key={c.committee_id} value={c.committee_id}>{i + 1}. {c.committee_name}</option>)}
            </Form.Select>
        </div>

        <div className='row'>
            {enunciados.filter(e => !e.votacao_fim ).map(e => <Enunciado 
                key={e.attendee_id} 
                enunciado={e} 
                filtro={filtro}
            />)}
        </div>
    </Layout>
}

export default comPermissao(ControleVotacao, "PRESIDENTE", "PRESIDENTA", "RELATOR", "RELATORA") ;