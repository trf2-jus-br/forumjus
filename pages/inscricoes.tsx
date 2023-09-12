import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheck, faInfo } from '@fortawesome/free-solid-svg-icons'
import { Button, CloseButton, Form, Modal, Nav } from 'react-bootstrap';
import { Formik } from 'formik';
import Usuario, { valor } from '../components/register/usuario';
import Enunciado from '../components/register/enunciado';
import mysql from '../utils/mysql';

interface Inscricao {
    statement_id: number,
    forum_id: number,
    attendee_id: number,
    committee_id: number,
    statement_text: string,
    statement_justification: string,
    statement_acceptance_datetime: null,
    statement_rejection_datetime: null,
    occupation_id: number,
    attendee_name: string,
    attendee_chosen_name: string | null,
    attendee_email: string,
    attendee_phone: string,
    attendee_document: string,
    attendee_affiliation: null,
    attendee_disability: string,
    attendee_acceptance_datetime: null,
    attendee_rejection_datetime: null
}

enum Status {
    ACEITO = "Aceito",
    REJEITADO = "Rejeitado",
    PENDENTE = "Pendente",
}

type Aba = "enunciado" | "autor" | "registro"

function status(inscricao: Inscricao){
    if(inscricao.statement_acceptance_datetime) 
        return "10px green solid";
    
    if(inscricao.statement_rejection_datetime) 
        return "10px red solid";
    
    return "none";
}

export async function getServerSideProps({ params }) {
    return {
      props: {
        API_URL_BROWSER: process.env.API_URL_BROWSER,
        forumConstants: await mysql.loadForumConstants(1)
      },
    };
  }

function Inscricoes ({forumConstants}){
    const [inscricoes, setInscricoes] = useState<Inscricao[]>()    
    const [detalhes, setDetalhes] = useState<Inscricao>()
    const [exibirModalDetalhes, setExibirModalDetalhes] = useState(false)
    const [aba, setAba] = useState<Aba>("enunciado")

    function carregarInscricoes(){
        fetch("api/inscricao")
        .then(async (d)=> setInscricoes(await d.json()))
        .catch(e => alert(e))
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

    async function aprovar(inscricao : Inscricao, aprovado?: boolean){
        const id = inscricao.statement_id
        const url = aprovado === false ? 'api/inscricao/rejeitar' : 'api/inscricao/aprovar';
        try{
            const r = await fetch(url, { method: "POST",  body: JSON.stringify({id})});
            if(!r.ok)
                throw r.statusText

            carregarInscricoes()
        }catch(err){
            console.log(err);
        }
    }

    console.log(forumConstants)


    return <Layout errorMessage={undefined} setErrorMessage={undefined}>
        <h3>Inscrições</h3>
        <table className='table table-hover table-light table-striped text-center'>
            <thead className='thead-dark'>
                <tr className='align-middle'>
                    <th className='col-1'>ID</th>
                    <th className='col-9'>Enunciado</th>
                    <th className='col-2'>Ações</th>
                </tr>
            </thead>
            <tbody>
                {inscricoes?.map(
                    e => <tr key={e.statement_id} style={{borderLeft: status(e)}}>
                        <td>{e.statement_id}</td>
                        <td>{e.statement_text}</td>
                        <td className='align-middle'>
                            <FontAwesomeIcon className='btn d-inline' title='Aprovar' onClick={() => aprovar(e)} icon={faCheck} />
                            <FontAwesomeIcon className='btn d-inline' title='Rejeitar' onClick={() => aprovar(e, false)} icon={faBan} />
                            <FontAwesomeIcon className='btn d-inline' title='Detalhes' onClick={()=> mostrarDetalhes(e)} icon={faInfo} />
                        </td>   
                    </tr>
                )}
            </tbody>
        </table>


        <Modal show={exibirModalDetalhes} size='xl' onHide={ocultarDetalhes} scrollable>
            <Nav variant='tabs' activeKey={aba} onSelect={(aba: Aba) => setAba(aba)}>
                <Nav.Item>
                    <Nav.Link eventKey="enunciado">Enunciado</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="autor">Autor</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="registro">Registro</Nav.Link>
                </Nav.Item>
                <CloseButton style={{ position: "absolute", top: "10px", right: "10px"}} onClick={ocultarDetalhes} />
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
                    onSubmit={()=> console.log("oi")} 
                >
                    {props => {
                        switch(aba){
                            case "enunciado": 
                                return <Enunciado {...props} disabled={true} forumConstants={forumConstants}/>

                            case "autor": 
                                return <Usuario {...props} disabled={true} />

                            case "registro": 
                                return <Usuario {...props} disabled={true} />
                        }
                    }}                  
                </Formik>}
            </Modal.Body>

            <Modal.Footer>
                <Button style={{marginRight: "auto"}} onClick={()=> aprovar(detalhes)}>Salvar alterações</Button>

                <Button variant='danger' onClick={()=> aprovar(detalhes, false)}>Rejeitar</Button>
                <Button onClick={()=> aprovar(detalhes)}>Aprovar</Button>
            </Modal.Footer>
        </Modal>
    </Layout>
}

export default Inscricoes;