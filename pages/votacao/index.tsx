import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Comite from './comite';

import type { CRUD } from '../../components/crud/crud';
import { Breadcrumb } from 'react-bootstrap';

function Votacao(){
    const [comites, setComites] = useState<CRUD.Comite[]>();

    useEffect(()=>{
        fetch("/api/votacao")
        .then(async res => {
            if(!res.ok)
                throw res.statusText;

            setComites(await res.json())
        })
        .catch(err => alert(err));
    }, [])

    return <Layout>
        <Breadcrumb>
            <Breadcrumb.Item href='/votacao' active={true}>Votação</Breadcrumb.Item>
        </Breadcrumb>

        <div className='d-flex row'>
            {comites?.map( c => <Comite comite={c} />) }
        </div>
    </Layout>
}

export default Votacao;