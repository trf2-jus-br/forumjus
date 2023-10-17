import React, {useState} from 'react';
import { Button, Card, Collapse } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faRepeat, faRotateBack } from '@fortawesome/free-solid-svg-icons';
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';

enum Filtro {
    TODOS,
    EM_ANALISE,
    ADMITIDOS,
    REJEITADOS
}

interface Props {
    enunciado: Enunciado,
    trocarComite: (e : Enunciado) => void;
    filtro: Filtro
}

function filtrar(filtro: Filtro, admitido: 0 | 1 | null){
    switch(filtro){
        case Filtro.TODOS: return true;
        case Filtro.EM_ANALISE: return admitido === null;
        case Filtro.ADMITIDOS: return admitido === 1;
        case Filtro.REJEITADOS: return admitido === 0;
    }
}

function Enunciado({ enunciado, trocarComite, filtro} : Props){
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

    if(!filtrar(filtro, admitido))
        return null;

    return (
        <div  className={`col-lg-6 col-12`}>
            <Card className={`mb-3 ${borda}`} style={{paddingBottom: 12, height: 'calc(100% - 24px)'}}>
                
               
                    <div className='d-flex justify-content-between w-100'>
                        <span className={`text-${texto}`} style={{fontWeight: 600, marginLeft: 10}}>{admitido === null ? '' : admitido ? "Admitido" : "Rejeitado" }</span>
                        { admitido === null &&
                            <Tooltip mensagem='Trocar a comissão' posicao='left'>
                                <Button 
                                    size="sm"
                                    className={`btn-warning m-1`} 
                                    style={{opacity: 1, marginLeft: 'auto'}} 
                                    onClick={()=> trocarComite(enunciado)}
                                >
                                    <FontAwesomeIcon color='white' icon={faRepeat} />
                                </Button>
                            </Tooltip>
                        }
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
                <div style={e.mostarMais} onClick={() => setMostrarMais(!mostrarMais)}>
                    {mostrarMais ? '- Mostrar menos' : '+ Mostrar mais'}
                </div>
            </Card>
        </div>
    )
}

const e = {
    mostarMais : {
        width: "100%",
        textAlign: "left",
        marginTop: "10px",
        marginLeft: '5px',
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 0
    }
}

export default Enunciado;