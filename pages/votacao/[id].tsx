import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Enunciado from './enunciado';
import { Breadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/router';

function Votacao(props){
    const [enunciados, setEnunciados] = useState<Enunciado[]>([]);
    const [atualizador, setAtualizador] = useState(true);
    const router = useRouter();

    useEffect(()=>{
        if(router.query.id === undefined)
            return

        fetch(`/api/votacao/${router.query.id}`)
        .then(async res => {
            if(!res.ok)
                throw res.statusText;

            setEnunciados(await res.json());
        })
        .catch(err => console.log(err));

        const timeout = setTimeout(() => setAtualizador(a => !a), 4000)
        return () => clearTimeout(timeout);
    }, [router, atualizador]);

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