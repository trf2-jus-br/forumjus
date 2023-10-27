import React, {useState} from 'react';
import { Button, Card, Collapse } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faComments, faListCheck, faRepeat, faRotateBack, faStop } from '@fortawesome/free-solid-svg-icons';
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';

interface Props {
    enunciado: Enunciado,
    filtro: number,
    acao: Function,
    ativo: boolean
}

export function formatarCodigo({committee_id, codigo}: Enunciado){
    if(!codigo)
        return '';
    
    return committee_id + codigo.toString().padStart(3, "0");
}

function Enunciado({ enunciado, filtro, acao, ativo} : Props){
    const [mostrarMais, setMostrarMais] = useState(false);

    const {
        statement_text, statement_justification, committee_id
    } = enunciado;

    const {api} = usarContexto();

    if(filtro !== null && filtro != committee_id)
        return <></>;

    return (
        <div  className={`col-lg-6 col-12`}>
            <Card className={`mb-3`} style={{paddingBottom: 12, height: 'calc(100% - 24px)'}}>
                    <div className='d-flex justify-content-between w-100'>
                        <span className={`text`} style={{fontWeight: 600, marginLeft: 10}}>{formatarCodigo(enunciado)}</span>
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

                <div style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                    <Tooltip mensagem='Iniciar votação' posicao='top'>
                        <Button 
                            className={`btn m-1`} 
                            style={{opacity: 1}} 
                            onClick={()=> acao()}
                            variant={ativo? 'danger' : 'primary'}
                        >
                            <FontAwesomeIcon fontSize={18} icon={ativo ? faStop: faListCheck} />
                        </Button>
                    </Tooltip>
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