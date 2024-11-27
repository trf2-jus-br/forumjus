import React, { useRef } from 'react';
import { Chart } from 'react-google-charts';
import { Button, Modal, Spinner } from "react-bootstrap";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import { usarContexto } from "../../contexto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleExclamation, faCircleXmark, faClock, faStopwatch, faUser } from "@fortawesome/free-solid-svg-icons";
import comRestricao from '../../utils/com-restricao';
import { retornoAPI } from '../../utils/api-retorno';
import Abertura from './abertura';
import Cabecalho from './cabecalho';
import Encerramento from './encerramento';
import Carregamento from './carregamento';

import {EstadoJornada, EstadoVotacao} from '../../utils/enums';
import Grafico from './grafico';

interface Props {
    telao?: boolean
}

type Visibilidade = 'visivel' | 'oculto';

function formatarData(tempoEmSegundos: number){
    if(tempoEmSegundos <= 0)
        return `0:00`;

    const minutos = Math.floor(tempoEmSegundos / 60);
    const segundos = tempoEmSegundos - 60 * minutos;

    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
}

function Votacao({telao}: Props){
    const [votacao, setVotacao] = useState<Votacao>(undefined);
    const [votoUsuario, setVotoUsuario] = useState(null);
    const [processandoVoto, setProcessandoVoto] = useState(false);
    const [visibilidade, setVisibilidade] = useState<Visibilidade>('oculto');
    const [obrigado, setExibirEncerramento] = useState(false);

    const { api, usuario, exibirNotificacao } = usarContexto();
    
    const timeoutRef = useRef(null);

    async function carregar(){
        try{
            const {data} = await api.get<Votacao>('/api/votacao');

            if(data.estadoJornada === EstadoJornada.ENCERRAMENTO){
                if(!timeoutRef.current){
                    timeoutRef.current = setTimeout(()=> {
                        if(telao){
                            setVisibilidade('oculto');
                            window.location.href = '/resumo-jornada';
                        }else{
                            setExibirEncerramento(true);
                        }
                    } , 4000);
                }else{
                    return;
                }
            }

            if(visibilidade === 'visivel' && votacao.justificativa != data?.justificativa){
                return setVisibilidade('oculto')
            }

            // Só atualizo o objeto votação, nunca deixo ele nulo.
            // Fiz isso para viabilizar as animações.
            if(data){
                setVisibilidade('visivel')
                setVotacao(!data ? null : data);
                const votoUsuario = data.votos.find(({id})=> id === usuario.id);
                setVotoUsuario(votoUsuario.voto);
            }else{
                setVotacao(null);
            }
        }catch(err){
            // avisa sobre o erro.
            exibirNotificacao({
                titulo: "Não foi possível carregar a votação.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    async function votar(favoravel: boolean){
        // impede que o usuário clique 10 vezes no botão.
        if(processandoVoto || votoUsuario !== null)
            return;

        setProcessandoVoto(true);

        try{
            await api.post("/api/votacao", {
                votacao: votacao.votacao,
                favoravel,
            })
            setVotoUsuario(favoravel ? 1 : 0);
        }catch(err){
            exibirNotificacao({
                titulo: "Não foi possível processar o seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        } finally {
            setProcessandoVoto(false);
        }
    }

    useEffect(()=>{
        const interval = setInterval(()=> carregar(), 1000);
        
        return () => {
            clearInterval(interval);
        }
    }, [votacao, visibilidade])

    const votos_contrarios = votacao?.votos?.filter(({voto}) => voto === 0)?.length || 0;
    const votos_favoraveis = votacao?.votos?.filter(({voto}) => voto === 1)?.length || 0;

    const estadoVotacao = votacao?.estadoVotacao;
    const barraCronometro = votacao?.inicio_defesa >= 0 && votacao?.cronometro !== 0 ?  votacao.inicio_defesa / votacao.cronometro : 0;

    const classeJustificativa = estadoVotacao === EstadoVotacao.FINALIZADO && telao ? 'opacity-0' : 'opacity-100';

    if(obrigado){
        return <Layout fluid cabecalho={<Cabecalho/>}>
            <Encerramento />
        </Layout>
    }
    

    if(!telao && votacao?.presencaRegistrada === false){
        return <Layout fluid cabecalho={<Cabecalho/>}>
            <Modal show={true} centered>
                <Modal.Body style={{ 
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                }}>
                    <FontAwesomeIcon fontSize={60} className="m-1" color={'#900'} icon={faCircleExclamation}/>
                    <div style={{fontSize: 20, marginTop: 10, marginBottom: 5, fontWeight: 600}}>Para votar</div>
                    <div>Registre sua presença</div>                
                </Modal.Body>
            </Modal>
        </Layout>
    }

    return <Layout fluid cabecalho={<Cabecalho/>}>
        {votacao === null && <Abertura />}
        {votacao && (
            <div className={`d-flex flex-column align-items-center w-100 ${visibilidade === 'oculto' ? 'opacity-0' : 'opacity-100'}`} 
            style={{transition: "all 0.5s", flex: 1, overflow: 'hidden'}}
        >
            <div className="d-flex justify-content-between w-100 align-items-center" style={{minHeight: 65}}>
                <div className='col-1'></div>
                <h5 className={`votacao-comissao col-10 text-center ${visibilidade}`}>{votacao.comissao}</h5>
                
                <div className="d-flex align-items-center justify-content-end col-1 tex">
                    {telao && (estadoVotacao === EstadoVotacao.APRESENTACAO_ENUNCIADO || estadoVotacao === EstadoVotacao.CRONOMETRO_DEFESA) ? 
                        <div>
                            <FontAwesomeIcon fontSize={30} className="m-1" color={'#1390d8'} icon={faStopwatch}/>
                            <div className='votacao-cronometro'>{formatarData(votacao.inicio_defesa)}</div>
                        </div>
                        :
                        <>
                            {telao && <span style={{fontSize: 18}} className="p-2">{ votos_contrarios + votos_favoraveis } / {votacao.quorum}</span>}
                        </>
                    }
                </div>
            </div>
            
            <div className="w-100 d-flex flex-row" style={{position: 'relative',}}>
                {
                    (estadoVotacao === EstadoVotacao.FINALIZADO) ? <>
                        <hr style={{
                            display: votos_favoraveis == 0 ? 'none' : 'block',
                            border: 'solid 3px green', 
                            transition: 'width 1s',
                            width: `${100* votos_favoraveis / (votos_favoraveis + votos_contrarios)}%`
                        }} />

                        <hr style={{
                            display: votos_contrarios == 0 ? 'none' : 'block',
                            border: 'solid 3px red', 
                            transition: 'width 1s',
                            width: `${100* votos_contrarios / (votos_favoraveis + votos_contrarios)}%`}} 
                        />    
                    </> : 
                    
                    <>
                        <hr style={{
                            border: 'solid 3px #999', 
                            width: `${100}%`}} 
                        />

                        {<hr style={{
                            position: 'absolute',
                            left: 0,
                            border: 'none',
                            //border: 'solid 3px #1390d8', 
                            height: 6,
                            background: '#1390d8',
                            transition: estadoVotacao === EstadoVotacao.CRONOMETRO_DEFESA ? "all 1.5s" : '',
                            width: `${estadoVotacao === EstadoVotacao.CRONOMETRO_DEFESA ? 100 * barraCronometro  : 100}%`}} 
                        />}
                    </> 
                }
                
            </div>

            <div className="d-flex w-100">
                {/*telao && <div className="col-2"></div>*/}

                <div className={`col-12 ${visibilidade}`}>
                    <div className='votacao-texto' style={{...e.enunciado}}>{votacao.texto}</div>
                    <hr className="w-100" />
                    <div className={`votacao-justificativa ${classeJustificativa}`}>
                        {votacao.justificativa}
                        <hr className="w-100" />
                    </div>
                </div>
            </div>
            {/*estadoVotacao === EstadoVotacao.VOTACAO &&  telao && <div className="col-12 d-flex flex-column text-center px-5" style={{position: 'absolute', bottom: 10}}>
                <h5 className="">
                    Votos registrados
                    <h6 className='d-block'>
                        { votos_contrarios + votos_favoraveis } / {votacao.votos.length}
                    </h6>
                </h5>
                <div className='d-flex flex-wrap w-100 justify-content-between' style={{}}>
                {votacao.votos.slice(0, 0).map(m => {
                        const cor = m.voto === null ? "#999" : m.voto === 0 ? "#900" : "#070";
                        const icone = m.voto === 0 ? faCircleXmark : faCircleCheck;

                        return (
                        <div key={m.id} style={{width: '23%'}}>
                            <div className="flex-row d-flex align-items-center justify-content-center w-100">
                                <div style={{...e.membro, color: cor}} >{m.nome}</div>
                                {m.voto !== null && <FontAwesomeIcon className="m-1" color={cor} icon={icone}/>}
                            </div>
                            <hr className="w-100"/>
                        </div>)
                    })
                }
                </div>
            </div>*/}
 
            <Grafico 
                visivel={estadoVotacao === EstadoVotacao.FINALIZADO && telao} 
                key={votacao.justificativa} 
                quorum={votacao.quorum}
                aprovado={votacao.aprovado}
                votos_favoraveis={votos_favoraveis} 
                votos_contrarios={votos_contrarios} 
            />
            
            {
                !telao && (
                    <div className="d-flex w-100 justify-content-between" style={{position:'fixed', bottom:'0', padding: '1rem'}}>
                        <Button 
                            className={estadoVotacao === EstadoVotacao.VOTACAO ? 'opacity-100' : 'opacity-0'} 
                            variant="danger" 
                            style={{width: 'calc(50% - 0.5rem)'}} 
                            onClick={()=> votar(false)}
                        >
                            Contra
                        </Button>
                        <Button 
                            className={estadoVotacao === EstadoVotacao.VOTACAO ? 'opacity-100' : 'opacity-0'} 
                            variant="success" 
                            style={{width: 'calc(50% - 0.5rem)'}} 
                            onClick={()=> votar(true)}
                        >
                            A favor
                        </Button>
                    </div>
                )
            }
        </div>
        )}


        <Modal show={!telao && votoUsuario !== null} centered>
            <Modal.Body style={{ 
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
            }}>
                <FontAwesomeIcon fontSize={60} className="m-1" color={'#070'} icon={faCircleCheck}/>
                <div style={{fontSize: 20, marginTop: 10, marginBottom: 5, fontWeight: 600}}>Voto registrado com sucesso.</div>
                <div>Acompanhe a votação pelo telão.</div>                
            </Modal.Body>
        </Modal>
    </Layout>
}

const e : {[key: string]: React.CSSProperties} = {
    enunciado: {
        textAlign: "center",
        margin: 5,
        textIndent: 50,
        lineHeight: 1.5,
        fontWeight: 500,
    },
    membro: {
        fontSize: 14
    },
}

export default comRestricao(Votacao, "ASSESSORIA", "PROGRAMADOR");