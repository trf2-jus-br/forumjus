import React, {useEffect, useState} from "react";
import { Breadcrumb, Button, Form, Modal } from "react-bootstrap";
import Layout from "../../components/layout";
import { usarContexto } from "../../contexto";
import Enunciado, { formatarCodigo } from "./enunciado";
import comPermissao from "../../utils/com-permissao";
import { retornoAPI } from "../../utils/api-retorno";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStopwatch } from "@fortawesome/free-solid-svg-icons";

import {EstadoVotacao} from '../../utils/enums';

type EnunciadoVotacao = Enunciado & {
    votacao_id : number,
    votacao_inicio: string,
    votacao_fim: string,
}

function ControleVotacao(){
    const [comites, setComites] = useState<Comite[]>();
    const [enunciados, setEnunciados] = useState<EnunciadoVotacao[]>([]);
    const [filtro, setFiltro] = useState<number>(null)
    const [enunciadoGerenciado, setEnunciadoGerenciado] = useState<EnunciadoVotacao>(null);

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

            const ativo = data.find(e => e.votacao_inicio != null && e.votacao_fim == null);
            setEnunciadoGerenciado(ativo);
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

    async function alterarEstadoVotacao(estadoVotacao: EstadoVotacao, cronometro?: number){
        try{
            await api.patch('/api/votacao', {
                enunciado: enunciadoGerenciado.statement_id, 
                estadoVotacao,
                cronometro
            })

            await carregar();
            exibirNotificacao({ texto: "Votação alterada com sucesso!",})
        }catch(err){
            // Notifica que ocorreu um erro.            
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    async function pararVotacao(){
        try{
            await api.delete('/api/votacao')
            await carregar();

            exibirNotificacao({
                texto: "Votação encerrada com sucesso!",
            })
        }catch(err){
            // Notifica que ocorreu um erro.            
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    async function cancelarVotacao(){
        if(!confirm("Ao sair desta votação, os votos serão apagados.\nTem certeza?"))
            return;

        try{
            await api.delete(`/api/votacao/cancelar?id=${enunciadoGerenciado.votacao_id}`);
            await carregar();

            exibirNotificacao({
                texto: "Votação cancelada com sucesso!",
            })
        }catch(err){
            // Notifica que ocorreu um erro.            
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    function cancelarEnunciado(){
        if(enunciadoGerenciado.votacao_inicio == null)
            setEnunciadoGerenciado(null);
    }

    function gerenciarEnunciado(enunciado: EnunciadoVotacao){
        setEnunciadoGerenciado(enunciado);
    }    

    function editar(){
        window.open(`/enunciado/editar-redacao?id=${enunciadoGerenciado.statement_id}`)
    }
    
    function juntar(){
        window.open(`/enunciado/juntar?id=${enunciadoGerenciado.statement_id}`)
    }

    useEffect(()=>{
        carregar();
        carregarComissoes();
    }, [])

    const codigo = !enunciadoGerenciado ? null : formatarCodigo({
        committee_id: enunciadoGerenciado.committee_id, 
        codigo: enunciadoGerenciado.codigo
    });

    function criterioOrdenacao(A: EnunciadoVotacao, B: EnunciadoVotacao){
        if(A.committee_id === B.committee_id)
            return A.codigo > B.codigo ? 1 : -1;

        return A.committee_id > B.committee_id ? 1 : -1;
    }

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
            {enunciados.sort(criterioOrdenacao).filter(e => !e.votacao_fim ).map(e => <Enunciado 
                key={e.statement_id} 
                enunciado={e} 
                filtro={filtro}
                gerenciarEnunciado={gerenciarEnunciado}
            />)}
        </div>

        <Modal show={enunciadoGerenciado != null} onHide={cancelarEnunciado}>
            <Modal.Header>Controle da votação <h6>{codigo}</h6></Modal.Header>
            <Modal.Body className="d-flex justify-content-between flex-wrap" style={{gap: 20}}>
                <span>{enunciadoGerenciado?.statement_text}</span>
                <hr className="w-100" />
                <Button className="w-100" onClick={() => alterarEstadoVotacao(EstadoVotacao.APRESENTACAO_ENUNCIADO)}>1. Apresentar enunciado</Button>
                
                <div className="d-flex w-100 justify-content-between" >
                    <Button style={{width: '31%'}}  onClick={() => alterarEstadoVotacao(EstadoVotacao.CRONOMETRO_DEFESA, 60)}>
                        <FontAwesomeIcon style={{marginRight: 5}} icon={faStopwatch} />
                         1:00
                    </Button>

                    <Button style={{width: '31%'}}   onClick={() => alterarEstadoVotacao(EstadoVotacao.CRONOMETRO_DEFESA, 120)}>
                        <FontAwesomeIcon style={{marginRight: 5}} icon={faStopwatch} />
                         2:00
                    </Button>
                    <Button  style={{width: '31%'}}  onClick={() => alterarEstadoVotacao(EstadoVotacao.CRONOMETRO_DEFESA, 180)}>
                        <FontAwesomeIcon style={{marginRight: 5}} icon={faStopwatch} />
                         3:00
                    </Button>
                </div>
                
                <Button className="w-100" onClick={() => alterarEstadoVotacao(EstadoVotacao.VOTACAO)}>3. Iniciar votação</Button>
                <Button className="w-100" onClick={() => pararVotacao()}>4. Finalizar votação</Button>
                <Button className="w-100" variant="danger" onClick={cancelarVotacao}>5. Sair da votação</Button>
                <hr className="w-100" />
                {/*<Button className="w-100" onClick={juntar} variant="warning">Juntar a outro enunciado</Button>*/}
                <Button className="w-100" onClick={editar} variant="warning">Editar este enunciado</Button>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>
    </Layout>
}

export default comPermissao(ControleVotacao, "PRESIDENTE", "PRESIDENTA", "RELATOR", "RELATORA") ;