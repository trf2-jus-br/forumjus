import React, {useRef, useState} from 'react';
import { Button, Card, Collapse } from 'react-bootstrap';

import type { CRUD } from '../../components/crud/crud';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';

interface Props {
    enunciado: CRUD.Enunciado,
    favor: number,
    contra: number,
    concluido: boolean,
    pode_voltar: boolean
}

function Enunciado({ enunciado, favor, contra, concluido, pode_voltar} : Props){
    const [voto, setVoto] = useState(pode_voltar);
    const [mostrarMais, setMostrarMais] = useState(false);



    function aprovar(){
        votar({aFavor: true});
    }

    function rejeitar(){
        votar({aFavor: false});
    }

    function votar({aFavor}){
        setVoto(aFavor)
    }

    const aprovado = favor > contra;

    return (
        <Card className={`m-3 ${ !concluido || voto === null ? "" : aprovado ? 'border-success' : 'border-danger'}`} style={{maxWidth: 400, width:"100%", paddingBottom: 12}}>
            {voto !== null && 
                <div className='d-flex align-items-center justify-content-between w-100'>
                    <span className={`text-${!concluido ? "" : aprovado? 'success' : 'danger'}`} style={{fontWeight: 600}}>{ !concluido ? "Votação em andamento" : aprovado ? "Aprovado" : "Rejeitado" }</span>
                </div>    
            }
            
            <Card.Body className='d-flex flex-column text-center align-items-center justify-content-center'>
                {enunciado.statement_text}
                <Collapse in={mostrarMais}>
                    <div className='w-100'>
                        <hr />
                        {enunciado.statement_justification}
                    </div>
                </Collapse>
            </Card.Body>
            <div style={e.mostarMais} onClick={() => setMostrarMais(!mostrarMais)}>+ Mostrar mais</div>
            <div style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                <Button className={`btn-danger m-1`} style={{opacity: 1}} onClick={rejeitar} disabled={voto !== null}>
                    { voto === null ? "CONTRA" : 
                        <> 
                            {contra} <FontAwesomeIcon style={{marginLeft: 5}} icon={faBan} />
                        </>
                    }
                </Button>
                <Button className={`btn-success m-1`} style={{opacity: 1}} onClick={aprovar} disabled={voto !== null}>
                    { voto === null ? "A FAVOR" : 
                        <> 
                            {favor} <FontAwesomeIcon style={{marginLeft: 5}} icon={faCheck} />
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