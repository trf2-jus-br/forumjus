import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheck, faExchange, faIcons, faInfo, faTable } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb, Button, CloseButton, Form, Modal, Nav, Table } from 'react-bootstrap';
import { Formik } from 'formik';
import Usuario from '../../components/register/usuario';
import Enunciado from '../../components/register/enunciado';
import { usarContexto } from '../../contexto';
import Comite from '../admissao/comite';
import Tooltip from '../../components/tooltip';
import { formatarCodigo } from '../admissao/enunciado';
import Registro from '../../components/register/registro';



enum Status {
    ACEITO = "Aceito",
    REJEITADO = "Rejeitado",
    PENDENTE = "Pendente",
}

type Aba = "enunciado" | "autor" | "registro" ;

function status(inscricao: Inscricao){
    if(inscricao.statement_acceptance_datetime) 
        return "10px green solid";
    
    if(inscricao.statement_rejection_datetime) 
        return "10px red solid";
    
    return "none";
}

function Inscricoes (props){
    const [inscricoes, setInscricoes] = useState<Inscricao[]>()    
    const [detalhes, setDetalhes] = useState<Inscricao>()
    const [exibirModalDetalhes, setExibirModalDetalhes] = useState(false)
    const [aba, setAba] = useState<Aba>("enunciado")
    const [comites, setComites] = useState<DetalheComite[]>([]);
    const [filtro, setFiltro] = useState<null | -1 | number>(null);
    const [tabela, setTabela] = useState(false);

    const { api, usuario } = usarContexto();

    async function carregarInscricoes(){
        api.get<Inscricao[]>("/api/inscricao")
            .then(({data}) => setInscricoes(data))
            .catch(err => {
                // Apenas notifica o usuário que ocorreu um erro.
                // A página será montada com as outras informações, mas certamente não será funcional.
            });

        api.get<DetalheComite[]>("/api/comite?detalhes=true")
            .then(({data}) => setComites(data))
            .catch(err => {
                // Apenas notifica o usuário que ocorreu um erro.
                // A página será montada com as outras informações, mas certamente não será funcional.
            });
    }

    useEffect(()=>{
        carregarInscricoes();
    }, [])

    function mostrarDetalhes(i : Inscricao){
        setAba("enunciado")
        setDetalhes(i)
        setExibirModalDetalhes(true)
    }

    function ocultarDetalhes(){
        setDetalhes(null)
        setExibirModalDetalhes(false)
    }


    const inscricoes_filtradas = inscricoes?.filter(k => filtro === -1 || k.committee_id === filtro);
    return <Layout>
        <div className='d-flex align-items-start justify-content-between'>
            <Breadcrumb>
                <Breadcrumb.Item onClick={()=> setFiltro(null)}  active={filtro === null}>Inscrições</Breadcrumb.Item>
                {filtro !== null && <Breadcrumb.Item active>Detalhes</Breadcrumb.Item>}

                {filtro == null &&
                    <Tooltip mensagem='Exibe a estatística em forma de tabela.'>
                        <FontAwesomeIcon onClick={()=> setTabela(!tabela)} style={{marginLeft: 5, marginTop: 5, cursor: "pointer"}} icon={faExchange} />
                    </Tooltip>
                }
            </Breadcrumb>


            {filtro != null && usuario.permissoes.estatistica &&
                <Form.Select size='sm' value={filtro} style={{width: '40%'}} onChange={(e)=> setFiltro(parseInt(e.target.value))}>
                    <option value={-1}>TODOS</option>
                    {comites?.map( (c, i) => <option key={c.committee_id} value={c.committee_id}>{c.committee_id}. {c.committee_name}</option>)}
                </Form.Select>
            }
        </div>
        
        {filtro == null && (
            tabela ? 
            
            <Table hover={true}>
                <thead>
                    <tr>
                        <th>Comissão</th>
                        <th className='text-center'>Inscrições</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {comites?.map( c => <tr style={{cursor:'pointer'}} key={c.committee_id} onClick={()=> setFiltro(c.committee_id)}>
                        <td>{c.committee_name}</td>
                        <td className='text-center' >{c.enunciados}</td>
                        <td></td>
                    </tr>)}
                </tbody>
            </Table>
            :
            <div className='d-flex row'>
                {comites?.map( c => <Comite key={c.committee_id} comite={c} setFiltro={setFiltro} />) }
            </div>
        )}

        {filtro != null && 
        <table className='table table-hover text-center'>
            <thead className='thead-dark'>
                <tr className='align-middle'>
                    {<th className='col-1'>ID</th>}
                    <th className='col-9'>Enunciado</th>
                    <th className='col-2'>Ações</th>
                </tr>
            </thead>
            <tbody>
                {inscricoes_filtradas?.map(
                    e => <tr key={e.statement_id} style={{borderLeft: status(e)}} onClick={()=> mostrarDetalhes(e)}>
                        {<td style={{cursor:'pointer'}}>{ formatarCodigo(e)}</td>}
                        <td style={{cursor:'pointer'}}>{e.statement_text}</td>
                        <td style={{cursor:'pointer'}} className='align-middle'>
                            <FontAwesomeIcon className='btn d-inline' title='Detalhes' onClick={()=> mostrarDetalhes(e)} icon={faInfo} />
                        </td>   
                    </tr>
                )}
            </tbody>
        </table>}


        <Modal show={exibirModalDetalhes} size='xl' onHide={ocultarDetalhes} scrollable={true}>
            <Nav variant='tabs' className='mb-3' activeKey={aba} onSelect={(aba: Aba) => setAba(aba)}>
                <Nav.Item>
                    <Nav.Link eventKey="enunciado">Enunciado</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="autor">Autor</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="registro">Registros</Nav.Link>
                </Nav.Item>
                <CloseButton style={{position: 'absolute', right: 10, top: 10}} onClick={ocultarDetalhes} />
            </Nav>
            <Modal.Body>
                {detalhes && <Formik 
                    enableReinitialize={true} 
                    initialValues={{
                        attendeeName: detalhes.attendee_name,
                        attendeeChosenName: detalhes.attendee_chosen_name,
                        attendeeEmail: detalhes.attendee_email,
                        attendeeEmailConfirmation: detalhes.attendee_email,
                        attendeePhone: detalhes.attendee_phone,
                        attendeeDocument: detalhes.attendee_document,
                        attendeeOccupationId: detalhes.occupation_id,
                        attendeeDisabilityYN: detalhes.attendee_disability != null && detalhes.attendee_disability !== "",
                        attendeeDisability: detalhes.attendee_disability,
                        attendeeAffiliation: detalhes.attendee_affiliation,
                        statement: [{
                            text: detalhes.statement_text,
                            justification: detalhes.statement_justification,
                            committeeId: detalhes.committee_id
                        }]
                    }} 
                    onSubmit={null} 
                >
                    {props => {
                        switch(aba){
                            case "enunciado": 
                                return <Enunciado {...props} disabled={true} comites={comites}/>

                            case "autor": 
                                return <Usuario {...props} disabled={true} />

                            case "registro":
                                return <Registro id={detalhes.statement_id}/>
                        }
                    }}                  
                </Formik>}
            </Modal.Body>
        </Modal>
    </Layout>
}

export default Inscricoes;