import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Comite from './comite';
import { Breadcrumb } from 'react-bootstrap';
import { usarContexto } from '../../contexto';

type DetalheComite = Comite & {
    enunciados : number
}

function Admissao(){
    const [comites, setComites] = useState<DetalheComite[]>();
    const {exibirNotificacao, api} = usarContexto();

    useEffect(()=>{
        api.get<DetalheComite[]>('/api/votacao')
        .then(({data}) => setComites(data))
        .catch(err => exibirNotificacao({texto: 'Votação', titulo: 'Não foi possível carregar os enunciados.'}));
    }, [])

    return <Layout>
        <div className='d-flex row'>
            {comites?.map( c => <Comite key={c.committee_id} comite={c} />) }
        </div>
    </Layout>
}

export default Admissao;