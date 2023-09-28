import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Enunciado from './enunciado';
import { Form, Modal } from 'react-bootstrap';
import { usarContexto } from '../../contexto';

enum Estado {
    TODOS,
    EM_ANALISE,
    ADMITIDOS,
    REJEITADOS
}

function Votacao(props){
    const [enunciados, setEnunciados] = useState<Enunciado[]>([]);
    const [comites, setComites] = useState<Comite[]>()
    const [enunciado, trocarComite] = useState<Enunciado>(null)
    const [filtro, setFiltro] = useState<Estado>(Estado.TODOS);

    const {api} = usarContexto();

    useEffect(()=>{
        api.get<Enunciado[]>(`/api/admissao`)
            .then(({data}) => setEnunciados(data))
            .catch(err => alert(err));

        api.get<Comite[]>(`/api/comite`)
            .then(({data}) => setComites(data))
            .catch(err => alert(err));
    }, []);

    function alterarComite(committee_id){
        api.put('/api/enunciado', {
            committee_id,
            statement_id: enunciado.statement_id
        })
        .then(()=> window.location.reload())
    }

    function filtrar(enunciado : Enunciado){
        switch(filtro){
            case Estado.TODOS:
                return true;
            case Estado.EM_ANALISE:
                return enunciado.admitido === null;
            case Estado.ADMITIDOS:
                return enunciado.admitido === 1;
            case Estado.REJEITADOS:
                return enunciado.admitido === 0;
        }
    }

    console.log(filtro,
        JSON.stringify(enunciados, null, 2)
    )

    return <Layout>
        <h4>Admissão</h4>

        <Form.Select className='mb-3' onChange={(e)=> setFiltro(e.target.value)}>
            <option value={Estado.TODOS}>TODOS</option>
            <option value={Estado.EM_ANALISE}>EM ANÁLISE</option>
            <option value={Estado.ADMITIDOS}>ADMITIDOS</option>
            <option value={Estado.REJEITADOS}>REJEITADOS</option>
        </Form.Select>


        <div className='row'>
            {enunciados.filter(filtrar).map((e,i) => <Enunciado 
                key={e.statement_id} 
                enunciado={e} 
                trocarComite={trocarComite}
            />)}
        </div>

        <Modal show={enunciado != null} size='xl' scrollable onHide={()=> trocarComite(null)}>
            <Modal.Header closeButton>
            <Modal.Title>Comissões</Modal.Title>
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