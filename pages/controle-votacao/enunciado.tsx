import React, {useState} from 'react';
import { Button, Card, Collapse } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faComments, faListCheck, faRepeat, faRotateBack, faStop } from '@fortawesome/free-solid-svg-icons';
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';
import { retornoAPI } from '../../utils/api-retorno';

type EnunciadoVotacao = Enunciado & {
    votacao_inicio: string,
    votacao_fim: string,
}

interface Props {
    enunciado: EnunciadoVotacao,
    filtro: number,
    acao: Function,
}

export function formatarCodigo({committee_id, codigo}: Enunciado){
    if(!codigo)
        return '';
    
    return committee_id + codigo.toString().padStart(3, "0");
}

function Enunciado({ enunciado, filtro, acao} : Props){
    const [mostrarMais, setMostrarMais] = useState(false);
    const [ativo, setAtivo] = useState(enunciado.votacao_inicio != null && enunciado.votacao_fim == null);
    const [estilo, setEstilo] = useState({});

    const {
        statement_text, statement_justification, committee_id, statement_id,
    } = enunciado;

    const { api, exibirNotificacao } = usarContexto();

    async function iniciarVotacao(){
        try{
            await api.put('/api/votacao', {
                enunciado: statement_id
            })
            setAtivo(true);

            exibirNotificacao({
                texto: "Votação iniciada com sucesso!",
            })

        }catch(err){
            // Notifica que ocorreu um erro.            
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    async function pararVotacao(){
        try{
            await api.delete('/api/votacao')
            setEstilo(e.oculto);
            setAtivo(false);
            setTimeout(()=> setEstilo(e =>({...e, display: 'none'})), 251)

            exibirNotificacao({
                texto: "Votação encerrada com sucesso!",
            })
        }catch(err){
            // Notifica que ocorreu um erro.            
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    if(filtro !== null && filtro != committee_id)
        return <></>;

    return (
        <div className={`col-lg-6 col-12`} style={{...estilo, transition: "transform 0.25s, opacity 0.25s"}}>
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
                    <Tooltip mensagem={ativo ? 'Encerrar votação' : 'Iniciar votação'} posicao='top'>
                        <Button 
                            className={`btn m-1`} 
                            style={{opacity: 1}} 
                            onClick={ativo ? pararVotacao : iniciarVotacao}
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
    },
    oculto: {
        transform: "scale(0.75)",
        opacity: 0,
    }
}

export default Enunciado;