import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/layout';
import Comite from './comite';
import Enunciado from './enunciado';
import { CRUD } from '../../components/crud/crud';
import { Breadcrumb } from 'react-bootstrap';

function Votacao(props){
    const [enunciados, setEnunciados] = useState<CRUD.Enunciado[]>([]);
    const intervalRef = useRef(null);

    function atualizar(){
        setEnunciados(enunciados => {
            for(let i = 0; i < enunciados.length; i++){
                if((enunciados[i].favor || 0) + (enunciados[i].contra || 0) >= 5 + i - i%3)
                    continue;


                if(Math.random() > 0.5){
                    enunciados[i].favor = (enunciados[i].favor || 0) + 1; 
                }else{
                    enunciados[i].contra = (enunciados[i].contra || 0) + 1;
                }
            }

            return [...enunciados]
        });
    }

    useEffect(()=>{
        fetch("/api/crud?tabela=statement")
        .then(async res => {
            if(!res.ok)
                throw res.statusText;

            setEnunciados(await res.json());
        })
        .catch(err => alert(err));

        const intervalRef = setInterval(atualizar, 1000);

        return () => clearInterval(intervalRef.current);
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
                contra={e.contra || 0} 
                favor={e.favor || 0}
                concluido={(e.contra || 0) + (e.favor || 0) == 5 + i - i%3}
            />)}
        </div>
    </Layout>
}

export default Votacao;