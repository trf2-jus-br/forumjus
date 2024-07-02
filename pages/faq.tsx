import React from 'react';
import { Accordion, Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import Layout from '../components/layout';

function FAQ (){
    const dados = [
        { titulo: 'Como aprovar proposta de enunciado', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Como rejeitar proposta de enunciado', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Como desfazer análise de enunciado', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Como consultar proposta admitidas', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Pergunta 5', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Pergunta 6', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Pergunta 8', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Pergunta 9', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Pergunta 10', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
        { titulo: 'Pergunta 11', link: 'https://www.youtube.com/watch?v=4Dek1HPYJy8' },
    ]


    return <Layout>
        <Breadcrumb>
            <BreadcrumbItem active>Perguntas frequentes</BreadcrumbItem>
        </Breadcrumb>
        
        <Accordion>
            { dados.map((d, i) => (
                <Accordion.Item eventKey={d.titulo}>
                    <Accordion.Header>{i+1}. {d.titulo}</Accordion.Header>
                    <Accordion.Body className='text-center'>
                    <iframe width="420" height="315" src={d.link}></iframe>
                    </Accordion.Body>
                </Accordion.Item>    
            )) }
        </Accordion>
    </Layout>
}

export default FAQ;