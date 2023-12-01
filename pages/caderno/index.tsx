import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFileCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb, Button, Table } from 'react-bootstrap';
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';
import gerarCadernoPreliminar from './caderno-preliminar';
import comRestricao from '../../utils/com-restricao';
import { retornoAPI } from '../../utils/api-retorno';

enum CADERNO{
    ADMITIDO = 0,
    PRIMEIRA_VOTACAO = 1,
    SEGUNDA_VOTACAO = 2,
}

function Caderno (props){
    const [comites, setComites] = useState<Comite[]>([]);

    const { api, exibirNotificacao } = usarContexto();

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


    async function abrirAprovadosVotacaoGeral(comissao: number){
        try{
            const inscricoes = await carregarInscricoes(CADERNO.SEGUNDA_VOTACAO);
           
            console.log(
                JSON.stringify(inscricoes, null, 3)
            );

            if(inscricoes.length === 0)
                return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível', tipo: 'ERRO'});
            
            gerarCadernoPreliminar(inscricoes, comites, 'Caderno da Jornada')
        }catch(err){
            console.log(err);
            // A função carregarInscricoes já notifica o usuário.
        }
    }

    async function abrirAdmitidos(comissao: number){
        try{
            const inscricoes = await carregarInscricoes(CADERNO.ADMITIDO, comissao);
            
            if(inscricoes.length === 0)
                return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível', tipo: 'ERRO'});
            
            gerarCadernoPreliminar(inscricoes, comites, 'Caderno Preliminar')
        }catch(err){
            // A função carregarInscricoes já notifica o usuário.
        }
    }

    async function abrirAprovadosComissao(comissao: number){
        try{
            const inscricoes = await carregarInscricoes(CADERNO.PRIMEIRA_VOTACAO, comissao);
            
            if(inscricoes.length === 0)
                return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível', tipo: 'ERRO'});

            gerarCadernoPreliminar(inscricoes, comites, 'Caderno da Jornada')
        }catch(err){
            // A função carregarInscricoes já notifica o usuário.
        }
    }


    return <Layout>
        <div className='d-flex align-items-start justify-content-between'>
            <Breadcrumb>
                <Breadcrumb.Item active>Caderno</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        
        <div className='d-flex justify-content-center' >
            <Tooltip mensagem='aprovados na votação geral'>
                <Button onClick={abrirAprovadosVotacaoGeral}>
                    <FontAwesomeIcon icon={faFileCircleCheck} />
                    <span style={{marginLeft: 10}}>Caderno da Jornada</span>
                </Button>
            </Tooltip>
        </div>

        <Table hover={true}>
            <thead>
                <tr>
                    <th>Comissão</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {comites?.map( c => <tr key={c.committee_id}>
                    <td>{c.committee_name}</td>
                    <td className='text-center' >
                        <Tooltip mensagem='Admitidos' posicao='bottom'>
                            <FontAwesomeIcon 
                                onClick={() => abrirAdmitidos(c.committee_id)}
                                color='#b55e5e' 
                                style={{cursor: 'pointer', marginRight: 10}} 
                                icon={faFile} 
                            />
                        </Tooltip>

                        <Tooltip mensagem='Aprovados na comissão' posicao='bottom'>
                            <FontAwesomeIcon 
                                style={{cursor: 'pointer'}} 
                                color='#060' 
                                icon={faFileCircleCheck} 
                                onClick={() => abrirAprovadosComissao(c.committee_id)}
                            />
                        </Tooltip>
                    </td>
                </tr>)}
            </tbody>
        </Table>
    </Layout>
}

export default comRestricao(Caderno, "MEMBRO");