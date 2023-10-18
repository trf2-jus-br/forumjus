import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheck, faExchange, faFile, faFileAlt, faFileArchive, faFileCircleCheck, faFileCircleExclamation, faIcons, faInfo, faTable } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb, Button, CloseButton, Form, Modal, Nav, Table } from 'react-bootstrap';
import { Formik } from 'formik';
import Usuario from '../../components/register/usuario';
import Enunciado from '../../components/register/enunciado';
import { usarContexto } from '../../contexto';
import Comite from '../admissao/comite';
import Tooltip from '../../components/tooltip';



function Caderno (props){
    const [inscricoes, setInscricoes] = useState<Inscricao[]>()    
    const [detalhes, setDetalhes] = useState<Inscricao>()
    const [exibirModalDetalhes, setExibirModalDetalhes] = useState(false)
    const [aba, setAba] = useState<Aba>("enunciado")
    const [comites, setComites] = useState<DetalheComite[]>([]);
    const [filtro, setFiltro] = useState<null | -1 | number>(null);
    const [tabela, setTabela] = useState(false);

    const { api, usuario } = usarContexto();

    async function carregarInscricoes(){
        api.get<Inscricao[]>("/api/inscricao")
            .then(({data}) => setInscricoes(data))
            .catch(err => alert(err));

        api.get<DetalheComite[]>("/api/comite?detalhes=true")
            .then(({data}) => setComites(data))
            .catch(err => alert(err));
    }

    useEffect(()=>{
        carregarInscricoes();
    }, [])

    function mostrarDetalhes(i : Inscricao){
        setAba("enunciado")
        setDetalhes(i)
        setExibirModalDetalhes(true)
    }

    function ocultarDetalhes(){
        setDetalhes(null)
        setExibirModalDetalhes(false)
    }


    const inscricoes_filtradas = inscricoes?.filter(k => filtro === -1 || k.committee_id === filtro);
    return <Layout>
        <div className='d-flex align-items-start justify-content-between'>
            <Breadcrumb>
                <Breadcrumb.Item active>Caderno</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        
        <div className='d-flex justify-content-center' >
            <Button>
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
                {comites?.map( c => <tr style={{cursor:'pointer'}} key={c.committee_id} onClick={()=> setFiltro(c.committee_id)}>
                    <td>{c.committee_name}</td>
                    <td className='text-center' >
                        <Tooltip mensagem='Caderno Preliminar' posicao='bottom'>
                            <FontAwesomeIcon color='#b55e5e' style={{marginRight: 10}} icon={faFile} />
                        </Tooltip>

                        <Tooltip mensagem='Caderno Aprovado' posicao='bottom'>
                            <FontAwesomeIcon color='#060' icon={faFileCircleCheck} />
                        </Tooltip>
                    </td>
                </tr>)}
            </tbody>
        </Table>
    </Layout>
}

export default Caderno;