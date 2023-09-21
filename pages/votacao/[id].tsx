import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/layout';
import Comite from './comite';
import Enunciado from './enunciado';
import { CRUD } from '../../components/crud/crud';
import { Breadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/router';

function Votacao(props){
    const [enunciados, setEnunciados] = useState<CRUD.Enunciado[]>([]);
    const router = useRouter();

    function atualizar(){
        console.log("atualizar")
        fetch(`/api/votacao/${router.query.id}`)
        .then(async res => {
            if(!res.ok)
                throw res.statusText;

            setEnunciados(await res.json());
        })
        .catch(err => alert(err));
    }

    useEffect(()=>{
        atualizar();
        const interval = setInterval(atualizar, 1000);

        return () => clearInterval(interval);
    }, []);

    return <Layout>
        <Breadcrumb>
            <Breadcrumb.Item href='/votacao'>Votação</Breadcrumb.Item>
            <Breadcrumb.Item active={true}>Enunciados</Breadcrumb.Item>
        </Breadcrumb>

        <div className='d-flex row'>
            {enunciados.map((e,i) => <Enunciado 
                key={e.statement_id} 
                enunciado={e} 
                concluido={(e.contra || 0) + (e.favor || 0) == 5 + i - i%3}
                pode_votar={null}
            />)}
        </div>
    </Layout>
}

export default Votacao;