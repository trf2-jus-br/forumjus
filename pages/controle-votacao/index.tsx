import React, {useEffect, useState} from "react";
import { Breadcrumb, Form } from "react-bootstrap";
import Layout from "../../components/layout";
import { usarContexto } from "../../contexto";
import Enunciado from "./enunciado";

type EnunciadoVotado = Enunciado & {
    votado: 0 | 1
}

function ControleVotacao(){
    const [dia, setDia] = useState(1);
    const [comites, setComites] = useState<Comite[]>();
    const [enunciados, setEnunciados] = useState<Enunciado[]>([]);
    const [filtro, setFiltro] = useState<number>(null)
    const [votacaoAtual, setVotacaoAtual] = useState<Votacao>(null);

    const { api } = usarContexto();

    async function carregarVotacao(){
        const {data} = await api.get('/api/votacao');
        
        if(data !== "" && data !== null){
            setVotacaoAtual(data);
            throw "Finalize a votação atual, antes de iniciar outra.";
        }
    }

    async function iniciarVotacao(enunciado: number, dia: number){
        try{
            await carregarVotacao();
            await api.put('/api/votacao', {enunciado, dia})
        }catch(err){
            alert(err);
        }
    }

    async function carregar(){
        try{
            const {data} = await api.get<Enunciado[]>(`api/enunciado/votacao?dia=${dia}`);
            setEnunciados(data);


            const { data : comites } = await api.get<Comite[]>('/api/comite');
            setComites(comites)
            
        }catch(err){
            alert(err);
        }
    }

    useEffect(()=>{
        carregar();
    }, [dia])


    console.log(
        votacaoAtual
    )

    return <Layout>
        <div className='d-flex align-items-start justify-content-between'>
            <Breadcrumb>
                <Breadcrumb.Item active>Controle da votação</Breadcrumb.Item>
            </Breadcrumb>

            {dia == 2 &&
                <Form.Select size="sm" value={filtro} style={{width: '50%'}} onChange={(e)=> setFiltro(parseInt(e.target.value) || null)}>
                    <option value={null}>TODOS</option>
                    {comites?.map( (c, i) => <option key={c.committee_id} value={c.committee_id}>{i + 1}. {c.committee_name}</option>)}
                </Form.Select>
            }

            <Form.Select size='sm' className='mb-3' style={{width: '15%'}} onChange={(e)=> setDia(parseInt(e.target.value))}>
                <option value={1}>1º dia</option>
                <option value={2}>2º dia</option>
            </Form.Select>
        </div>

        <div className='row'>
            {enunciados.map(e => <Enunciado 
                key={e.attendee_id} 
                enunciado={e} 
                filtro={filtro}
                ativo={e.statement_text === votacaoAtual?.texto}
                acao={()=> iniciarVotacao(e.statement_id, dia)} />)}
        </div>
    </Layout>
}

export default ControleVotacao;