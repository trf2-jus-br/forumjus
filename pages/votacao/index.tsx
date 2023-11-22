import React from 'react';
import { Button, Modal, Spinner } from "react-bootstrap";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import { usarContexto } from "../../contexto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import comRestricao from '../../utils/com-restricao';
import { retornoAPI } from '../../utils/api-retorno';

interface Props {
    telao?: boolean
}

function Votacao({telao}: Props){
    const [votacao, setVotacao] = useState<Votacao>(null);
    const [votoUsuario, setVotoUsuario] = useState(null);
    const [processandoVoto, setProcessandoVoto] = useState(false);
    const [estilo, setEstilo] = useState({});

    const { api, usuario, exibirNotificacao } = usarContexto();
    
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
        //setVotoPendente(null);
    }

    useEffect(()=>{
        const interval = setInterval(()=> carregar(), 1000);
        
        return () => {
            clearInterval(interval);
        }
    }, [])

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
                    style={{opacity: estilo.opacity, transition: "all 0.5s", flex: 1}}
                >
                    <div className="d-flex justify-content-between w-100 align-items-center">
                        <div></div>
                        <div style={{...estilo}}>{votacao.comissao}</div>
                        
                        <div className="d-flex">
                            <span>{votos_favoraveis}</span>
                            <FontAwesomeIcon className="m-1" color={'#070'} icon={faCircleCheck}/>
                            <span>{votos_contrarios}</span>
                            <FontAwesomeIcon className="m-1" color={'#900'} icon={faCircleXmark}/>
                        </div>
                    </div>
                    
                    <div className="w-100 d-flex flex-row">
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
                            
                            <hr style={{
                                border: 'solid 3px #999', 
                                width: `100%`}} 
                            /> 
                        }
                        
                    </div>

                    <div className="d-flex">
                        {telao && <div className="col-2"></div>}
                        <div className={telao ? "col-8" : "col-12"}>
                            <div style={{...estilo, ...e.enunciado}}>{votacao.texto}</div>
                            <hr className="w-100" />
                            <div style={{...estilo, ...e.justificativa}}>{votacao.justificativa}</div>
                            <hr className="w-100" />
                        </div>
                        {telao && <div className="col-2 d-flex flex-column text-center px-5" style={estilo}>
                            <h5 className="">
                                Votos 
                                <h6 className='d-block'>
                                    { votos_contrarios + votos_favoraveis } / {votacao.votos.length}
                                </h6>
                            </h5>
                            {
                                votacao.votos.slice(0, 5).map(m => {
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
                        </div>}
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
    enunciado: {
        fontSize: 20,
        textAlign: "justify",
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