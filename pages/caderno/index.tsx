import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFileCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb, Button, Form, Table } from 'react-bootstrap';
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';
import gerarCaderno from './caderno-preliminar';
import comRestricao from '../../utils/com-restricao';
import { retornoAPI } from '../../utils/api-retorno';
import CheckBox from './checkbox';

enum CADERNO{
    TODOS = -1,
    ADMITIDO = 0,
    PRIMEIRA_VOTACAO = 1,
    SEGUNDA_VOTACAO = 2,
}


function url(img){
    if(!img)
        throw "Capas não foram configuradas corretamente";

    return {url: `${window.location.origin}/api/uploads/${img}`};
}

function Caderno (props){
    const [comites, setComites] = useState<Comite[]>([]);
    const [exibirJustificativas, setOcultarJustificativas] = useState<boolean>(false);
    const [exibirNomes, setOcultarNome] = useState<boolean>(false);
    const [exibirDatas, setOcultarData] = useState<boolean>(false);
    const [exibirCargos, setOcultarCargo] = useState<boolean>(false);

    const { api, exibirNotificacao, ambiente, usuario } = usarContexto();

    function obterComite(committee_id: number | null){
        return comites.find(c => c.committee_id === committee_id);
    }

    async function carregarComissoes(){
        api.get<Comite[]>("/api/comite")
            .then(({data}) => setComites(data))
            .catch((err) => {
                // Notifica o usuário que ocorreu um erro.
                exibirNotificacao({
                    titulo: "Não foi possível carregar as comissões.",
                    texto: retornoAPI(err),
                    tipo: "ERRO"
                })

                // Tenta recarregar as comissões.
                setTimeout(carregarComissoes, 1000)
            });
    }

    async function carregarInscricoes(nivel: CADERNO, comissao?: number){
        try{
            const {data} = await api.get<Inscricao[]>(`/api/caderno?nivel=${nivel}&comissao=${comissao}`)
            return data;
        }catch(err){
            // Apenas notifica o usuário que ocorreu um erro.
            // Consequência do erro: Nada acontece, usuário deve clicar novamente para tentar outra vez.
            exibirNotificacao({
                titulo: "Não foi possível carregar as inscrições.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    useEffect(()=>{
        carregarComissoes();
    }, [])


    async function abrirAprovadosPlenaria(comissao: number){
        try{
            const inscricoes = await carregarInscricoes(CADERNO.SEGUNDA_VOTACAO, comissao);
           
            if(inscricoes.length === 0)
                return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível', tipo: 'ERRO'});
            
            const comite = obterComite(comissao);
            const capa = url(comite?.capa_proposta_plenaria || ambiente.CAPA_GENERICA_CADERNO);

            gerarCaderno({
                ambiente,
                inscricoes, 
                comites, 
                titulo: 'Caderno da Jornada', 
                preliminar: false, 
                exibir : {
                    cargos: exibirCargos,
                    datas: exibirDatas,
                    justificativas: exibirJustificativas,
                    nomes: exibirNomes
                },
                capa
            });
        }catch(err){
            exibirNotificacao({
                titulo: "Não foi possível abrir o caderno.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }


    async function abrirTodasInscricoesRecebidas(comissao: number){
        try{
            const inscricoes = await carregarInscricoes(CADERNO.TODOS, comissao);
           
            if(inscricoes.length === 0)
                return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível', tipo: 'ERRO'});
            

            const comite = obterComite(comissao);
            const capa = url(comite?.capa_proposta_recebida || ambiente.CAPA_GENERICA_CADERNO);

            gerarCaderno({
                ambiente,
                inscricoes, 
                comites, 
                titulo: 'Caderno de Propostas da Jornada',
                preliminar: true, 
                exibir : {
                    cargos: exibirCargos,
                    datas: exibirDatas,
                    justificativas: exibirJustificativas,
                    nomes: exibirNomes
                },
                capa
            });
        }catch(err){
            exibirNotificacao({
                titulo: "Não foi possível abrir o caderno.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    async function abrirAdmitidos(comissao: number){
        try{
            const inscricoes = await carregarInscricoes(CADERNO.ADMITIDO, comissao);
            
            if(inscricoes.length === 0)
                return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível', tipo: 'ERRO'});
            
            const comite = obterComite(comissao);
            const capa = url(comite?.capa_proposta_admitida || ambiente.CAPA_GENERICA_CADERNO);

            gerarCaderno({
                ambiente,
                inscricoes, 
                comites, 
                titulo: 'Caderno Preliminar', 
                preliminar: true, 
                exibir : {
                    cargos: exibirCargos,
                    datas: exibirDatas,
                    justificativas: exibirJustificativas,
                    nomes: exibirNomes
                },
                capa,
            });
        }catch(err){
            exibirNotificacao({
                titulo: "Não foi possível abrir o caderno.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    async function abrirAprovadosComissao(comissao: number){
        try{
            const inscricoes = await carregarInscricoes(CADERNO.PRIMEIRA_VOTACAO, comissao);
            
            if(inscricoes.length === 0)
                return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível', tipo: 'ERRO'});

            const comite = obterComite(comissao);
            const capa = url(comite?.capa_proposta_comissao || ambiente.CAPA_GENERICA_CADERNO);
            
            gerarCaderno({
                ambiente,
                inscricoes, 
                comites, 
                titulo: 'Caderno da Jornada',
                preliminar: true, 
                exibir : {
                    cargos: exibirCargos,
                    datas: exibirDatas,
                    justificativas: exibirJustificativas,
                    nomes: exibirNomes
                },
                capa
            })
        }catch(err){
            exibirNotificacao({
                titulo: "Não foi possível abrir o caderno.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    const todos : Partial<Comite> = {
        committee_id: null,
        committee_name: 'TODOS'
    };

    const exibirTodas = usuario.recursos['pages/inscricoes#exibirTodas'];//usuario.funcao === "PROGRAMADOR" || usuario.funcao === "ASSESSORIA";

    const comissoesExibidas = exibirTodas ? [todos, ...comites] : comites;

    return <Layout>
        <div className='d-flex align-items-start justify-content-between'>
            <Breadcrumb>
                <Breadcrumb.Item active>Caderno</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        
        <div className='d-flex justify-content-center' >
        <Tooltip mensagem='aprovados na votação geral'>
                <Button onClick={abrirAprovadosPlenaria}>
                    <FontAwesomeIcon icon={faFileCircleCheck} />
                    <span style={{marginLeft: 10}}>Caderno da Jornada</span>
                </Button>
            </Tooltip>
        </div>

        <Table hover={true}>
            <thead>
                <tr>
                    <th>Comissão</th>
                    <th>
                        <div className='d-flex w-100' style={{gap: 10}}>
                            <CheckBox titulo='Justificativas' valor={exibirJustificativas} onChange={setOcultarJustificativas} />
                            <CheckBox titulo='Nomes' valor={exibirNomes} onChange={setOcultarNome} />
                            <CheckBox titulo='Cargos' valor={exibirCargos} onChange={setOcultarCargo} />
                            <CheckBox titulo='Datas' valor={exibirDatas} onChange={setOcultarData} />
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {comissoesExibidas?.map( c => <tr key={c.committee_id}>
                    <td>{c.committee_name}</td>
                    <td className='text-center' >
                        {
                            (exibirTodas || usuario.permissoes.votar_comissoes.indexOf(c.committee_id) !== -1 ) && <>
                            <Tooltip mensagem='Todas Inscrições' posicao='bottom'>
                                <FontAwesomeIcon 
                                    onClick={() => abrirTodasInscricoesRecebidas(c.committee_id)}
                                    color='#009' 
                                    style={{cursor: 'pointer', marginRight: 10}} 
                                    icon={faFile} 
                                />
                            </Tooltip>

                            <Tooltip mensagem='Admitidos' posicao='bottom'>
                                <FontAwesomeIcon 
                                    onClick={() => abrirAdmitidos(c.committee_id)}
                                    color='#b55e5e' 
                                    style={{cursor: 'pointer', marginRight: 10}} 
                                    icon={faFile} 
                                />
                            </Tooltip>
                        </>}
                        

                        <Tooltip mensagem='Aprovados na comissão' posicao='bottom'>
                            <FontAwesomeIcon 
                                style={{cursor: 'pointer',  marginRight: 10}} 
                                color='#060' 
                                icon={faFileCircleCheck} 
                                onClick={() => abrirAprovadosComissao(c.committee_id)}
                            />
                        </Tooltip>

                        <Tooltip mensagem='Aprovados na plenária' posicao='bottom'>
                            <FontAwesomeIcon 
                                style={{cursor: 'pointer'}} 
                                color='#990' 
                                icon={faFileCircleCheck} 
                                onClick={() => abrirAprovadosPlenaria(c.committee_id)}
                            />
                        </Tooltip>
                    </td>
                </tr>)}
            </tbody>
        </Table>
    </Layout>
}

export default comRestricao(Caderno, "MEMBRO");