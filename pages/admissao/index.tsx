import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Enunciado from './enunciado';
import { Card, Collapse, Form, Modal, Table } from 'react-bootstrap';
import { usarContexto } from '../../contexto';

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
            .catch(err => alert(err));

        api.get<Comite[]>(`/api/comite`)
            .then(({data}) => setComites(data))
            .catch(err => alert(err));
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
        .catch(err => alert(err));
    }

    return <Layout>
        <div className='d-flex align-items-center justify-content-between'>
            <h4>Admissão</h4>

            <Form.Select className='mb-3' style={{width: '30%'}} onChange={(e)=> setFiltro(parseInt(e.target.value))}>
                <option value={Filtro.TODOS}>TODOS</option>
                <option value={Filtro.EM_ANALISE}>EM ANÁLISE</option>
                <option value={Filtro.ADMITIDOS}>ADMITIDOS</option>
                <option value={Filtro.REJEITADOS}>REJEITADOS</option>
            </Form.Select>
        </div>

        <div>
            <Collapse in={true}>
                <Card className='m-2 mb-5'>
                    <Card.Body>
                        <Table>
                            <thead>
                                <th></th>
                                <th className='text-center'>Inscrições</th>
                                <th className='text-center'>Admitidos</th>
                                <th className='text-center'>Rejeitados</th>
                            </thead>
                            <tbody>
                                {comites?.map(e => 
                                    <tr>
                                        <td>{e.committee_name}</td>
                                        <td className='text-center'>20</td>
                                        <td className='text-center'>15</td>
                                        <td className='text-center'>5</td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Collapse>    
            
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

export default Votacao;