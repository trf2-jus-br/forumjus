import React, {useRef, useState} from 'react';
import { Button, Card, Collapse } from 'react-bootstrap';

import type { CRUD } from '../../components/crud/crud';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';

interface Props {
    enunciado: CRUD.Enunciado,
    concluido: boolean,
    pode_votar: boolean
}

function Enunciado({ enunciado, concluido, pode_votar} : Props){
    const [voto, setVoto] = useState(pode_votar);
    const [mostrarMais, setMostrarMais] = useState(false);

    const {
        statement_acceptance, statement_rejection,
        statement_text, statement_justification, statement_id, committee_id
    } = enunciado;

    function votar({contra}){
        fetch('/api/votacao', {
            method: 'POST',
            body: JSON.stringify({contra, statement_id, committee_id})
        })
        .then( res => {
            if(!res.ok)
                throw res.statusText;
        })
        .catch(err => alert(err));
        //setVoto(contra)
    }

    const aprovado = statement_acceptance > statement_rejection;

    return (
        <Card className={`m-3 ${ !concluido || voto === null ? "" : aprovado ? 'border-success' : 'border-danger'}`} style={{maxWidth: 400, width:"100%", paddingBottom: 12}}>
            {voto !== null && 
                <div className='d-flex align-items-center justify-content-between w-100'>
                    <span className={`text-${!concluido ? "" : aprovado? 'success' : 'danger'}`} style={{fontWeight: 600}}>{ !concluido ? "Votação em andamento" : aprovado ? "Aprovado" : "Rejeitado" }</span>
                </div>    
            }
            
            <Card.Body className='d-flex flex-column text-center align-items-center justify-content-center'>
                {statement_text}
                <Collapse in={mostrarMais}>
                    <div className='w-100'>
                        <hr />
                        {statement_justification}
                    </div>
                </Collapse>
            </Card.Body>
            <div style={e.mostarMais} onClick={() => setMostrarMais(!mostrarMais)}>+ Mostrar mais</div>
            <div style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                <Button 
                    className={`btn-danger m-1`} 
                    style={{opacity: 1}} 
                    disabled={voto !== null}
                    onClick={() => votar({contra: true})}
                >
                    { voto === null ? 
                        "CONTRA" : 
                        <> 
                            {statement_rejection}
                            <FontAwesomeIcon style={{marginLeft: 5}} icon={faBan} />
                        </>
                    }
                </Button>
                <Button 
                    className={`btn-success m-1`} 
                    style={{opacity: 1}} 
                    disabled={voto !== null}
                    onClick={() => votar({contra: false})}
                >
                    { voto === null ? 
                        "A FAVOR" : 
                        <>
                            {statement_acceptance} 
                            <FontAwesomeIcon style={{marginLeft: 5}} icon={faCheck} />
                        </>
                    }
                </Button>
            </div>
        </Card>
    )
}

const e = {
    mostarMais : {
        width: "100%",
        textAlign: "left",
        marginTop: "10px",
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 20
    }
}

export default Enunciado;