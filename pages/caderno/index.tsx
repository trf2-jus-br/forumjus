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



function Caderno (props){
    const [inscricoes, setInscricoes] = useState<Inscricao[]>()    
    const [comites, setComites] = useState<DetalheComite[]>([]);

    const { api, exibirNotificacao } = usarContexto();

    async function carregarComissoes(){
        api.get<DetalheComite[]>("/api/comite?detalhes=true")
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

    async function carregarInscricoes(){
        api.get<Inscricao[]>("/api/inscricao")
            .then(({data}) => setInscricoes(data))
            .catch((err) => {
                // Notifica o usuário que ocorreu um erro.
                exibirNotificacao({
                    titulo: "Não foi possível carregar as inscrições.",
                    texto: retornoAPI(err),
                    tipo: "ERRO"
                })

                // Tenta recarregar as inscrições.
                setTimeout(carregarInscricoes, 1000)
            });
    }

    useEffect(()=>{
        carregarInscricoes();
        carregarComissoes();
    }, [])


    function abrirCadernoJornada(){
        const filtro = inscricoes.filter(i => i.admitido && 
            i.votos_afavor_1 > i.votos_contra_1.toString() 
            && i.votos_afavor_2 > i.votos_contra_2
        );

        if(filtro.length === 0)
            return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível'});
        
        gerarCadernoPreliminar(inscricoes, comites, 'Caderno da Jornada')
    }

    function abrirCadernoPreliminar(comissao: number){
        const filtro = inscricoes.filter(i => i.committee_id === comissao && i.admitido);

        console.log(inscricoes, comissao);

        if(filtro.length === 0)
            return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível'});
        
        gerarCadernoPreliminar(filtro, comites, 'Caderno Preliminar')
    }

    function abrirCaderno(comissao: number){
        const filtro = inscricoes.filter(i => i.committee_id === comissao && 
            i.admitido && 
            i.votos_afavor_1 > i.votos_contra_1.toString() && 
            i.votos_afavor_2 > i.votos_contra_2
        );

        if(filtro.length === 0)
            return exibirNotificacao({titulo: 'Caderno Jornada', texto: 'Caderno indisponível'});

        gerarCadernoPreliminar(filtro, comites, 'Caderno da Jornada')
    }


    return <Layout>
        <div className='d-flex align-items-start justify-content-between'>
            <Breadcrumb>
                <Breadcrumb.Item active>Caderno</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        
        <div className='d-flex justify-content-center' >
            <Button onClick={abrirCadernoJornada}>
                <FontAwesomeIcon icon={faFileCircleCheck} />
                <span style={{marginLeft: 10}}>Caderno da Jornada</span>
            </Button>
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
                        <Tooltip mensagem='Caderno Preliminar' posicao='bottom'>
                            <FontAwesomeIcon 
                                onClick={() => abrirCadernoPreliminar(c.committee_id)}
                                color='#b55e5e' 
                                style={{cursor: 'pointer', marginRight: 10}} 
                                icon={faFile} 
                            />
                        </Tooltip>

                        <Tooltip mensagem='Caderno Aprovado' posicao='bottom'>
                            <FontAwesomeIcon 
                                style={{cursor: 'pointer'}} 
                                color='#060' 
                                icon={faFileCircleCheck} 
                                onClick={() => abrirCaderno(c.committee_id)}
                            />
                        </Tooltip>
                    </td>
                </tr>)}
            </tbody>
        </Table>
    </Layout>
}

export default comRestricao(Caderno, "MEMBRO");