import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import Layout from "../../components/layout";
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';
import comPermissao from '../../utils/com-permissao';
import { retornoAPI } from '../../utils/api-retorno';

interface Proponente {
    nome : string,
    email : string,
    admitido : 0 | 1,
    committee_name : string
    committee_id: number,
}

function NotificarParticipacao(){
    const [proponentes, setProponentes] = useState<Proponente[][]>([]);

    const {api, exibirNotificacao} = usarContexto();
    
    async function carregar(){
        try{
            const {data} = await api.get<Proponente[]>("/api/proponente");
            
            const grupos : {[key: string] : Proponente[]} = {};

            data
                .sort( (a,b) => a.nome > b.nome ? 1 : -1)
                .forEach(p => {
                    if(!grupos[p.committee_name]){
                        grupos[p.committee_name] = [p]
                    }else{
                        grupos[p.committee_name].push(p);
                    }
                });

            setProponentes(Object.values(grupos).sort((a, b) => a[0].committee_id - b[0].committee_id  ));
        }catch(err){
            exibirNotificacao({
                titulo: "Não foi possível carregar os proponentes.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            }) 

            setTimeout(carregar, 1000)
        }
    }

    async function notificar(e){
        e.preventDefault();

        try{
            await api.post("/api/proponente/notificar")
            
            exibirNotificacao({
                texto: "E-mails enviados com sucesso!"
            })
        }catch(err){
            // Apenas avisa sobre o erro.
            exibirNotificacao({
                titulo: "Não foi possível processar seu pedido.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

    useEffect(()=>{
        carregar();
    }, [])

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
                            <td className='col-8' style={{color: m.admitido ?"#060" : "#c00", fontWeight: 500}}>{m.nome}</td>
                            <td style={{color: m.admitido ?"#060" : "#c00", fontWeight: 500}} className='text-center col-4 align-middle'>{m.email}</td>
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