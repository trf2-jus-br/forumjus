import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Enunciado from './enunciado';
import { Breadcrumb, Card, Collapse, Form, Modal, Table } from 'react-bootstrap';
import { usarContexto } from '../../contexto';
import comPermissao from '../../utils/com-permissao';
import comRestricao from '../../utils/com-restricao';

enum Filtro {
    TODOS,
    EM_ANALISE,
    ADMITIDOS,
    REJEITADOS
}

function Votacao(props){
    const [enunciados, setEnunciados] = useState<Enunciado[]>([]);
    const [comites, setComites] = useState<Comite[]>()
    const [enunciado, trocarComite] = useState<Enunciado>(null)
    const [filtro, setFiltro] = useState<Filtro>(Filtro.TODOS);

    const {api} = usarContexto();

    function carregar(){
        api.get<Enunciado[]>(`/api/admissao`)
            .then(({data}) => setEnunciados(data))
            .catch(err => {
                // Apenas notifica o usuário que ocorreu um erro.
                // A página será montada com as outras informações, mas certamente não será funcional.
            });

        api.get<Comite[]>(`/api/comite`)
            .then(({data}) => setComites(data))
            .catch(err => {
                // Apenas notifica o usuário que ocorreu um erro.
                // A página será montada com as outras informações, mas certamente não será funcional.
            });
    }

    useEffect(()=>{
                    carregar();
            }, []);

    function alterarComite(committee_id){
        api.put('/api/enunciado', {
            committee_id,
            statement_id: enunciado.statement_id
        })
        .then(()=> {
            trocarComite(null)
            carregar();
        })
        .catch(err => {
            // Apenas notifica o usuário que ocorreu um erro.
            // A página será montada com as outras informações, mas certamente não será funcional.
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
            />)}
        </div>

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

export default comPermissao(Votacao, 'RELATOR', 'RELATORA', 'PRESIDENTA', 'PRESIDENTE');