import React from 'react';
import Layout from '../../components/layout';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../components/tooltip';
import { usarContexto } from '../../contexto';
import RelatorioQuantidadeEnunciados from './relatorio-quantidade-enunciados';

function Relatorios(){
    const {api} = usarContexto();

    async function quantidadeEnunciados(){
        const {data} = await api.get<DetalheComite[]>("/api/comite?detalhes=true")
        RelatorioQuantidadeEnunciados(data);
    }

    const relatorios = [
        { nome: "Quantidade de propostas de enunciados", acao: quantidadeEnunciados }
    ]

    return <Layout>
        <Breadcrumb>
            <BreadcrumbItem active>Relatórios</BreadcrumbItem>
        </Breadcrumb>

        <table className='table table-striped'>
            <tbody>
                {relatorios.map(r => <tr key={r.nome}>
                    <td className='col-11'>{r.nome}</td>
                    <td>
                        <Tooltip mensagem='download'>
                            <FontAwesomeIcon style={{cursor: "pointer"}} onClick={r.acao} icon={faDownload} />
                        </Tooltip>
                    </td>
                </tr>
                )}
            </tbody>
        </table>
    </Layout>
}


export default Relatorios;