import React, {useState} from 'react';
import { Button, Card, Collapse } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faRepeat, faRotateBack } from '@fortawesome/free-solid-svg-icons';
import { usarContexto } from '../../contexto';

interface Props {
    enunciado: Enunciado,
    trocarComite: (e : Enunciado) => void;
}

function Enunciado({ enunciado, trocarComite} : Props){
    const [mostrarMais, setMostrarMais] = useState(false);
    const [admitido, setAdmitido] = useState(enunciado.admitido)

    const {
        statement_text, statement_justification, statement_id, committee_id
    } = enunciado;

    const {api} = usarContexto();

    function votar({admitido}){
        api.post('/api/admissao', { admitido, statement_id, committee_id})
        .then(()=> setAdmitido(admitido))
        .catch(err => alert(err));
    }

    function refazerAnalise(){
        api.delete(`/api/admissao?statement_id=${statement_id}`)
        .then(()=> setAdmitido(null))
        .catch(err => alert(err));
    }

    const borda = admitido === null ? '' : admitido ? 'border-success' : 'border-danger';
    const texto = admitido === null ? '' : admitido? 'success' : 'danger';

    return (
        <div  className={`col-lg-6 col-xl-4 col-12`}>
            <Card className={`mb-3 ${borda}`} style={{paddingBottom: 12, height: 'calc(100% - 24px)'}}>
                <div className='d-flex justify-content-between w-100'>
                    <span className={`text-${texto}`} style={{fontWeight: 600, marginLeft: 10}}>{admitido === null ? '' : admitido ? "Admitido" : "Rejeitado" }</span>
                    <Button 
                        size="sm"
                        title='Trocar a comissão'
                        className={`btn-warning m-1`} 
                        style={{opacity: 1, marginLeft: 'auto'}} 
                        onClick={()=> trocarComite(enunciado)}
                    >
                        <FontAwesomeIcon color='white' icon={faRepeat} />
                    </Button>
                </div>
                
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

                { admitido === null ?
                    <div style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                        <Button 
                            title='Rejeitar'
                            className={`btn-danger m-1`} 
                            style={{opacity: 1}} 
                            onClick={() => votar({admitido: false})}
                        >
                            <FontAwesomeIcon icon={faBan} />
                        </Button>
                        <Button 
                            title='Admitir'
                            className={`btn-success m-1`} 
                            style={{opacity: 1}} 
                            onClick={() => votar({admitido: true})}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </Button>
                    </div>
                    :
                    <div style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                        <Button 
                            title='Refazer análise'
                            className={`btn m-1`} 
                            style={{opacity: 1}} 
                            onClick={refazerAnalise}
                        >
                            <FontAwesomeIcon icon={faRotateBack} />
                        </Button>
                    </div>
                }
            </Card>
        </div>
    )
}

const e = {
    mostarMais : {
        width: "100%",
        textAlign: "left",
        marginTop: "10px",
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 0
    }
}

export default Enunciado;