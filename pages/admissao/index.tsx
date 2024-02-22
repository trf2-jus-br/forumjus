import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/layout';
import Enunciado from './enunciado';
import { Breadcrumb, Button, Card, Collapse, Form, Modal, Table } from 'react-bootstrap';
import { usarContexto } from '../../contexto';
import comPermissao from '../../utils/com-permissao';
import comRestricao from '../../utils/com-restricao';
import { retornoAPI } from '../../utils/api-retorno';
import ModalJustificativa from './justificativa';

enum Filtro {
    TODOS,
    EM_ANALISE,
    ADMITIDOS,
    REJEITADOS
}

function Admissao(props){
    const [enunciados, setEnunciados] = useState<Enunciado[]>([]);
    const [comites, setComites] = useState<Comite[]>()
    const [enunciado, trocarComite] = useState<Enunciado>(null)
    const [filtro, setFiltro] = useState<Filtro>(Filtro.TODOS);

    const justificativaRef = useRef(null);

    const {api, exibirNotificacao} = usarContexto();

    function carregarEnunciados(){
        api.get<Enunciado[]>(`/api/admissao`)
            .then(({data}) => {
                // recarregar os enunciados não altera a ordenação.
                data.sort((a, b) => {
                    const indA = enunciados.findIndex(({statement_id}) => a.statement_id == statement_id);
                    const indB = enunciados.findIndex(({statement_id}) => b.statement_id == statement_id);
                
                    return indA < indB ? -1 : 1;
                })

                setEnunciados(data)
            })
            .catch(err => {
                // Notifica o usuário que ocorreu um erro.
                exibirNotificacao({
                    titulo: "Não foi possível carregar os enunciados.",
                    texto: retornoAPI(err),
                    tipo: 'ERRO'
                })

                // Tenta recarregar os enunciados.
                setTimeout(carregarEnunciados, 1000);
            });
    }

    function carregarComissoes(){
        api.get<Comite[]>(`/api/comite`)
            .then(({data}) => setComites(data))
            .catch(err => {
                // Notifica o usuário que ocorreu um erro.
                exibirNotificacao({
                    titulo: "Não foi possível carregar as comissões.",
                    texto: retornoAPI(err),
                    tipo: "ERRO"
                })

                // Tenta recarregar as comissões.
                setTimeout(carregarComissoes, 1000);
            });
    }

    useEffect(()=>{
        carregarEnunciados();
        carregarComissoes();
    }, []);

    function alterarComite(committee_id){
        api.put('/api/enunciado', {
            committee_id,
            statement_id: enunciado.statement_id
        })
        .then(()=> {
            exibirNotificacao({
                texto: "Enunciado atualizado com sucesso!"
            })

            trocarComite(null)
            carregarEnunciados();
        })
        .catch(err => {
            // Apenas notifica o usuário que ocorreu um erro.
            // Resultado do error: Nada irá acontecer.
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        });
    }

    async function justificar(enunciado: Enunciado){
        let justificativa = null;
        try{
            //exibe modal para preenchimento da justificativa.
            justificativa  = await justificativaRef.current.exibir(enunciado.justificativa_analise, !enunciado.admitido); 
        }catch(err){
            return exibirNotificacao({ texto: "Atualização cancelada pelo usuário", tipo: 'ERRO'});
        }

        try{
            await api.put('/api/admissao', { justificativa, statement_id: enunciado.statement_id});

            exibirNotificacao({ texto: "Enunciado atualizado com sucesso!"})
            carregarEnunciados();
        }catch(err){
            // Apenas notifica o usuário que ocorreu um erro.
            // Resultado do error: Nada irá acontecer.
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
            
        }
    }

    async function analisar(enunciado: Enunciado, admitido){
        const {statement_id, committee_id} = enunciado;

        let justificativa = null;
        try{
            //exibe modal para preenchimento da justificativa.
            justificativa  = await justificativaRef.current.exibir("", !admitido); 
        }catch(err){
            return exibirNotificacao({ texto: "Atualização cancelada pelo usuário", tipo: 'ERRO'});
        }

        try{
            // atualiza o registro no servidor.
            await api.post('/api/admissao', { admitido, statement_id, committee_id, justificativa});

            exibirNotificacao({ texto: "Enunciado atualizado com sucesso!",})

            // atualiza a tela, mantendo a posição dos elementos.
            carregarEnunciados();
        }catch(err){
            // Apenas notifica o usuário que ocorreu um erro.
            // Resultado do erro: Nada irá mudar.
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    function refazerAnalise(enunciado: Enunciado){
        api.delete(`/api/admissao?statement_id=${enunciado.statement_id}`)
        .then(()=> {
            // atualiza a tela, mantendo a posição dos elementos.
            carregarEnunciados();
            exibirNotificacao({texto: "Enunciado atualizado com sucesso!"})
        })
        .catch(err => {
            // Apenas notifica o usuário que ocorreu um erro.
            // Resultado do erro: Nada irá mudar.
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        });
    }

    return <Layout>
        <div className='d-flex align-items-start justify-content-between'>
            <Breadcrumb>
                <Breadcrumb.Item active>Admissão</Breadcrumb.Item>
            </Breadcrumb>

            <Form.Select size='sm' className='mb-3' style={{width: '30%'}} onChange={(e)=> setFiltro(parseInt(e.target.value))}>
                <option value={Filtro.TODOS}>TODOS</option>
                <option value={Filtro.EM_ANALISE}>EM ANÁLISE</option>
                <option value={Filtro.ADMITIDOS}>ADMITIDOS</option>
                <option value={Filtro.REJEITADOS}>REJEITADOS</option>
            </Form.Select>
        </div>

        <div className='row'>
            {enunciados.map((e,i) => <Enunciado 
                filtro={filtro}
                key={e.statement_id} 
                enunciado={e} 
                trocarComite={trocarComite}
                justificar={justificar}
                analisar={analisar}
                refazerAnalise={refazerAnalise}
            />)}
        </div>

        <ModalJustificativa ref={justificativaRef} />

        <Modal show={enunciado != null} size='xl' scrollable onHide={()=> trocarComite(null)}>
            <Modal.Header closeButton>
            <Modal.Title>Selecione a Comissão para onde deseja enviar este enunciado:</Modal.Title>
            </Modal.Header>
            <Modal.Body className='form-control p-0 custom-select-container'>
            {
                enunciado && comites?.filter(c => c.committee_id != enunciado.committee_id)?.map( ({committee_id, committee_name, committee_description}) => (
                    <div key={committee_id} className='p-3 custom-option' onClick={() => alterarComite(committee_id)}>
                        <h6>{committee_name}</h6>
                        <div style={{paddingLeft: "20px"}}>{committee_description}</div>
                    </div>
                ))
            }
            </Modal.Body>
        </Modal>
    </Layout>
}

export default comPermissao(Admissao, 'RELATOR', 'RELATORA', 'PRESIDENTA', 'PRESIDENTE');