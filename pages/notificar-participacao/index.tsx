import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import Layout from "../../components/layout";
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';
import comPermissao from '../../utils/com-permissao';

interface Proponente {
    nome : string,
    email : string,
    admitido : 0 | 1,
    committee_name : string
    committee_id: number,
}

function NotificarParticipacao(){
    const [proponentes, setProponentes] = useState<Proponente[][]>([]);

    const {api} = usarContexto();
    
    async function carregar(){
        const {data} = await api.get<Proponente[]>("/api/proponente");
        
        const grupos : {[key: string] : Proponente[]} = {};

        data.forEach(p => {
            if(!grupos[p.committee_name]){
                grupos[p.committee_name] = [p]
            }else{
                grupos[p.committee_name].push(p);
            }

        });



        setProponentes(Object.values(grupos).sort((a, b) => a[0].committee_id - b[0].committee_id  ));
    }

    function notificar(e){
        e.preventDefault();

        api.post("/api/proponente/notificar")
    }

    useEffect(()=>{
        carregar();
    }, [])

    console.log(proponentes)

    return <Layout>
        <Breadcrumb>
            <Breadcrumb.Item active>Notificação</Breadcrumb.Item>
        </Breadcrumb>

        {
            proponentes?.map( grupo => (
                <Table className='mb-3' striped key={grupo[0].committee_name}>
                    <thead>
                        <tr>
                            <th style={{fontWeight: 600}} colSpan={2}>{grupo[0].committee_id}. {grupo[0].committee_name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupo?.map(m => <tr key={m.email}>
                            <td style={{color: m.admitido ?"#060" : "#c00", fontWeight: 500}}>{m.nome}</td>
                            <td style={{color: m.admitido ?"#060" : "#c00", fontWeight: 500}} className='text-center'>{m.email}</td>
                        </tr>)
                        }
                    </tbody>
                </Table>
            ))
        }
       
       <form className='mt-3 mb-3 d-flex align-items-center justify-content-between' onSubmit={notificar}>
            
            <label className='d-flex flex-row'>

            <Form.Check style={{paddingRight: 10}}>
                <Form.Check.Input type="checkbox" required/>
            </Form.Check>
                Declaro que conferi a listagem de emails
            </label>

            <Tooltip mensagem='Informa os proponentes se seus enunciados foram aprovados ou rejeitados.'>
                <Button type='submit'>Enviar e-mails</Button>
            </Tooltip>
        </form>
    </Layout>
}

export default comPermissao(NotificarParticipacao, "ASSESSORIA", "PROGRAMADOR");