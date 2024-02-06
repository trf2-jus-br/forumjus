import React from 'react';
import { Chart } from 'react-google-charts';
import { Button, Modal, Spinner } from "react-bootstrap";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import { usarContexto } from "../../contexto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faClock, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import comRestricao from '../../utils/com-restricao';
import { retornoAPI } from '../../utils/api-retorno';
import Script from 'next/script';

interface Props {
    telao?: boolean
}

const tempoMaximo = 10;

function Votacao({telao}: Props){
    const [votacao, setVotacao] = useState<Votacao>(null);
    const [votoUsuario, setVotoUsuario] = useState(null);
    const [processandoVoto, setProcessandoVoto] = useState(false);
    const [estilo, setEstilo] = useState({});
    const [temporizador, setTempoziador] = useState(null);

    const { api, usuario, exibirNotificacao } = usarContexto();
    

    const [exibirResultado, setExibirResultado] = useState(false);

    async function carregar(){
        try{
            const {data} = await api.get<Votacao>('/api/votacao');

            setEstilo(!data ? e.ocultar: e.exibir)

            // Só atualizo o objeto votação, nunca deixo ele nulo.
            // Fiz isso para viabilizar as animações.
            if(data){
                setVotacao(!data ? null : data);
                const votoUsuario = data.votos.find(({id})=> id === usuario.id);
                setVotoUsuario(votoUsuario.voto);

                const temporizadorAtualizado = tempoMaximo - data.inicio_defesa;

                if(temporizadorAtualizado > 0){
                    setTempoziador(temporizadorAtualizado);

                    
                }else if(temporizadorAtualizado <= 0 && temporizador > 0) {
                    setTempoziador(0);
                    alert("Simulando audio!")
                    setTimeout(() => setExibirResultado(true), 2000)
                }
            }else{
                setExibirResultado(false)
            }
        }catch(err){
            console.log(err)
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
    }, [temporizador])

    if(!votacao)
        return <Layout fluid>
            <div className='d-flex justify-content-center align-items-center' style={{flex: 1}}>
                <Spinner style={{color: "#0003"}} />
            </div>
        </Layout>


    const votos_contrarios = votacao?.votos?.filter(({voto}) => voto === 0)?.length || 0;
    const votos_favoraveis = votacao?.votos?.filter(({voto}) => voto === 1)?.length || 0;

    return <Layout fluid>
        {
             votacao &&
                <div className="d-flex flex-column align-items-center w-100" 
                    style={{opacity: estilo.opacity, transition: "all 0.5s", flex: 1, overflow: 'hidden'}}
                >
                    <div className="d-flex justify-content-between w-100 align-items-center">
                        <div></div>
                        <div style={{...estilo}}>{votacao.comissao}</div>
                        
                        <div className="d-flex align-items-center">
                            {/*temporizador > 0 ? */}
                                <FontAwesomeIcon fontSize={30} className="m-1" color={'#d8d013'} icon={faStopwatch}/>
                            {/*}    :
                                <>
                                    <span style={{fontSize: 30}}>{votos_favoraveis}</span>
                                    <FontAwesomeIcon fontSize={30} className="m-1" color={'#070'} icon={faCircleCheck}/>
                                    <span style={{fontSize: 30}}>{votos_contrarios}</span>
                                    <FontAwesomeIcon fontSize={30} className="m-1" color={'#900'} icon={faCircleXmark}/>    
                                </>
                            */}
                        </div>
                    </div>
                    
                    <div className="w-100 d-flex flex-row" style={{position: 'relative',}}>
                        {
                            (votos_contrarios !== 0 || votos_favoraveis !== 0) ? <>
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

                                {temporizador > 0 && <hr style={{
                                    position: 'absolute',
                                    left: 0,
                                    border: 'solid 3px #d8d013', 
                                    transition: "all 1.5s",
                                    width: `${100 * temporizador/tempoMaximo}%`}} 
                                />}
                            </> 
                        }
                        
                    </div>

                    <div className="d-flex w-100">
                        {/*telao && <div className="col-2"></div>*/}
                        <div className={/*telao ? "col-8" : */"col-12"}>
                            <div style={{...estilo, ...e.enunciado}}>{votacao.texto}</div>
                            <hr className="w-100" />
                            <div style={{
                                ...estilo, 
                                ...e.justificativa,
                                opacity: estilo.opacity && temporizador > 0 ? 1 : 0
                            }}>
                                {votacao.justificativa}
                                <hr className="w-100" />
                            </div>
                            
                        </div>
                        {/*telao && <div className="col-2 d-flex flex-column text-center px-5" style={estilo}>
                            <h5 className="">
                                Votos 
                                <h6 className='d-block'>
                                    { votos_contrarios + votos_favoraveis } / {votacao.votos.length}
                                </h6>
                            </h5>
                            {
                                votacao.votos.slice(0, 7).map(m => {
                                    const cor = m.voto === null ? "#999" : m.voto === 0 ? "#900" : "#070";
                                    const icone = m.voto === 0 ? faCircleXmark : faCircleCheck;

                                    return (
                                        <React.Fragment key={m.id}>
                                        <div className="flex-row d-flex align-items-center justify-content-center">
                                            <div style={{...e.membro, color: cor}} >{m.nome}</div>
                                            {m.voto !== null && <FontAwesomeIcon className="m-1" color={cor} icon={icone}/>}
                                        </div>
                                        <hr className="w-100"/>
                                    </React.Fragment>)
                                })
                            }
                        </div>*/}
                    </div>
                    <div style={{
                        ...e.containerGrafico, 
                        opacity: exibirResultado ? 1 : 0
                    }}>
                        <Chart 
                            chartType='PieChart' 
                            data={[
                                ["", ""],
                                ["Favoráveis", 9],
                                ["Contrários", 6],
                            ]} 
                            options={{
                                theme: 'maximized',
                                pieStartAngle: 180,
                                colors: ['#070', '#700'],
                                legend: {
                                    position: 'top',
                                    alignment: 'center',
                                },
                                chartArea: {'width': '100%', 'height': '80%'},
                            }}
                            width={"100%"}
                            height={"300px"} 
                        />
                        <div>Aprovado</div>
                    </div>
                    
                    {
                        !telao && (
                            <div className="d-flex w-100 justify-content-between" style={{marginTop: "auto", position:'sticky', bottom:'1rem'}}>
                                <Button variant="danger" style={{width: '49.5%'}} onClick={()=> votar(false)}>Contra</Button>
                                <Button variant="success" style={{width: '49.5%'}} onClick={()=> votar(true)}>A favor</Button>
                            </div>
                        )
                    }
                </div>
        }
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
    containerGrafico: {
        position: 'absolute',
        bottom: 32,
        transition: 'all 1s', 
        width: '100%',
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center'
    },
    enunciado: {
        fontSize: 20,
        textAlign: "center",
        margin: 5,
        textIndent: 50,
        lineHeight: 1.5,
        fontWeight: 600,
    },
    justificativa: {
        //fontSize: 18,
        textAlign: "justify",
        margin: 10,
        textIndent: 50,
        lineHeight: 1.75
    },
    membro: {
        fontSize: 14
    },
    exibir: {
        transition: "all 1s",
        transform: "scale(1)",
        opacity: 1,
    },
    ocultar: {
        transition: "all 1s",
        transform: "scale(0.75)",
        opacity: 0,
    },
}

export default comRestricao(Votacao, "ASSESSORIA", "PROGRAMADOR");