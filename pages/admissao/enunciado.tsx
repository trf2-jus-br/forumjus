import React, {useState} from 'react';
import { Button, Card, Collapse } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faComment, faRepeat, faRotateBack } from '@fortawesome/free-solid-svg-icons';
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';
import { retornoAPI } from '../../utils/api-retorno';

enum Filtro {
    TODOS,
    EM_ANALISE,
    ADMITIDOS,
    REJEITADOS
}

interface Props {
    enunciado: Enunciado,
    justificar: (enunciado: Enunciado) => void;
    trocarComite: (e : Enunciado) => void;
    filtro: Filtro,
    analisar: (enunciado: Enunciado, admitido: boolean) => void;
    refazerAnalise: (enunciado: Enunciado) => void;
}

function filtrar(filtro: Filtro, admitido: 0 | 1 | null){
    switch(filtro){
        case Filtro.TODOS: return true;
        case Filtro.EM_ANALISE: return admitido === null;
        case Filtro.ADMITIDOS: return admitido === 1;
        case Filtro.REJEITADOS: return admitido === 0;
    }
}

export function formatarCodigo({committee_id, codigo}: Enunciado){
    if(!codigo)
        return '';
    
    return committee_id + codigo.toString().padStart(3, "0");
}

function Enunciado(props : Props){
    const [mostrarMais, setMostrarMais] = useState(false);

    const { 
        enunciado, 
        trocarComite,
        filtro, 
        justificar, 
        analisar, 
        refazerAnalise
    } = props;

    const {
        statement_text, 
        statement_justification, 
        justificativa_analise, 
        admitido
    } = enunciado;

    if(!filtrar(filtro, admitido))
        return null;

    const codigo = formatarCodigo(enunciado);

    const borda = admitido === null ? '' : admitido ? 'border-success' : 'border-danger';
    const texto = admitido === null ? '' : admitido? 'success' : 'danger';

    function confirmarTroca(){
        if(!confirm("Esta ação não poderá ser desfeita, deseja continuar?")){
            return;
        }

        trocarComite(enunciado)
    }

    return (
        <div  className={`col-lg-6 col-12`}>
            <Card className={`mb-3 ${borda}`} style={{paddingBottom: 12, height: 'calc(100% - 24px)'}}>
                
               
                    <div className='d-flex justify-content-between w-100'>
                        <span className={`text-${texto}`} style={{fontWeight: 600, marginLeft: 10}}>{admitido === null ? '' : admitido ? `Admitido Nº ${codigo}` : "Rejeitado" }</span>
                        { admitido === null ?
                            <Tooltip mensagem='Trocar a comissão' posicao='left'>
                                <Button 
                                    size="sm"
                                    className={`btn-warning m-1`} 
                                    style={{opacity: 1, marginLeft: 'auto'}} 
                                    onClick={confirmarTroca}
                                >
                                    <FontAwesomeIcon color='white' icon={faRepeat} />
                                </Button>
                            </Tooltip>
                            :
                            <Tooltip mensagem={`Justificar ${admitido ? 'admissão' : 'rejeição'}`} posicao='left'>
                                <Button 
                                    size="sm"
                                    className={`btn-${texto} m-1`} 
                                    style={{opacity: 1, marginLeft: 'auto'}} 
                                    onClick={() => justificar(enunciado)}
                                >
                                    <FontAwesomeIcon color='white' icon={faComment} />
                                </Button>
                            </Tooltip>
                        }
                    </div>
                <Card.Body className='d-flex flex-column text-center align-items-center justify-content-center'>
                    {mostrarMais && justificativa_analise?.length > 0 && <div className={`w-100 text-${texto}`}>
                        {justificativa_analise}
                        <hr />
                    </div>}
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

                { admitido === null ?
                    <div style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                        <Tooltip mensagem='Rejeitar' posicao='top'>
                            <Button 
                                className={`btn-danger m-1`} 
                                style={{opacity: 1}} 
                                onClick={() => analisar(enunciado, false)}
                            >
                                <FontAwesomeIcon icon={faBan} />
                            </Button>
                        </Tooltip>

                        <Tooltip mensagem='Admitir' posicao='top'>
                            <Button 
                                className={`btn-success m-1`} 
                                style={{opacity: 1}} 
                                onClick={() => analisar(enunciado, true)}
                            >
                                <FontAwesomeIcon icon={faCheck} />
                            </Button>
                        </Tooltip>
                    </div>
                    :
                    <div style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                        <Tooltip mensagem='Refazer análise' posicao='top'>
                            <Button 
                                className={`btn m-1`} 
                                style={{opacity: 1}} 
                                onClick={() => refazerAnalise(enunciado)}
                            >
                                <FontAwesomeIcon icon={faRotateBack} />
                            </Button>
                        </Tooltip>
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
        marginLeft: '5px',
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 0
    }
}

export default Enunciado;