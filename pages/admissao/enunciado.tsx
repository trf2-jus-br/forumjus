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

export function formatarCodigo({committee_id, codigo}: Enunciado){
    if(!codigo)
        return '';
    
    return committee_id + codigo.toString().padStart(3, "0");
}

function Enunciado({ enunciado, trocarComite, filtro} : Props){
    const [mostrarMais, setMostrarMais] = useState(false);
    const [admitido, setAdmitido] = useState(enunciado.admitido)
    const [codigo, setCodigo] = useState<string>(formatarCodigo(enunciado));

    const {
        statement_text, statement_justification, statement_id, committee_id
    } = enunciado;

    const {api} = usarContexto();

    async function votar({admitido}){
        try{
            await api.post('/api/admissao', { admitido, statement_id, committee_id});
            setAdmitido(admitido ? 1 : 0);

            const {data} = await api.get<Enunciado>(`/api/enunciado?id=${statement_id}`);
            setCodigo(formatarCodigo(data));
        }catch(err){
            // Apenas notifica o usuário que ocorreu um erro.
            // A página será montada com as outras informações, mas certamente não será funcional.
        }
    }

    function refazerAnalise(){
        api.delete(`/api/admissao?statement_id=${statement_id}`)
        .then(()=> setAdmitido(null))
        .catch(err => {
            // Apenas notifica o usuário que ocorreu um erro.
            // A página será montada com as outras informações, mas certamente não será funcional.
        });
    }

    const borda = admitido === null ? '' : admitido ? 'border-success' : 'border-danger';
    const texto = admitido === null ? '' : admitido? 'success' : 'danger';

    if(!filtrar(filtro, admitido))
        return null;

    return (
        <div  className={`col-lg-6 col-12`}>
            <Card className={`mb-3 ${borda}`} style={{paddingBottom: 12, height: 'calc(100% - 24px)'}}>
                
               
                    <div className='d-flex justify-content-between w-100'>
                        <span className={`text-${texto}`} style={{fontWeight: 600, marginLeft: 10}}>{admitido === null ? '' : admitido ? `Admitido Nº ${codigo}` : "Rejeitado" }</span>
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

                { admitido === null ?
                    <div style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                        <Tooltip mensagem='Rejeitar' posicao='top'>
                            <Button 
                                className={`btn-danger m-1`} 
                                style={{opacity: 1}} 
                                onClick={() => votar({admitido: false})}
                            >
                                <FontAwesomeIcon icon={faBan} />
                            </Button>
                        </Tooltip>

                        <Tooltip mensagem='Admitir' posicao='top'>
                            <Button 
                                className={`btn-success m-1`} 
                                style={{opacity: 1}} 
                                onClick={() => votar({admitido: true})}
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
                                onClick={refazerAnalise}
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