import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import Layout from "../../components/layout";
import { usarContexto } from '../../contexto';
import Tooltip from '../../components/tooltip';
import comPermissao from '../../utils/com-permissao';
import { retornoAPI } from '../../utils/api-retorno';
import gerarCaderno from '../caderno/caderno-preliminar';

interface Proponente {
    nome : string,
    email : string,
    admitido : 0 | 1,
    committee_name : string
    committee_id: number,
}

enum CADERNO{
    TODOS = -1,
    ADMITIDO = 0,
    PRIMEIRA_VOTACAO = 1,
    SEGUNDA_VOTACAO = 2,
}

function url(img){
    if(!img)
        throw "Capas não foram configuradas corretamente";

    return {url: `${window.location.origin}/api/uploads/${img}`};
}

function NotificarParticipacao(){
    const [proponentes, setProponentes] = useState<Proponente[][]>([]);

    const {api, exibirNotificacao, ambiente} = usarContexto();
    
    async function carregarComissoes(){
        try{
            const {data} = await api.get<Comite[]>("/api/comite")
            return data;
        }catch(err){
            throw "Não foi possível carregar as comissões.";
        }
    }

    async function carregarInscricoes(nivel: CADERNO, comissao?: number){
        try{
            const {data} = await api.get<Inscricao[]>(`/api/caderno?nivel=${nivel}&comissao=${comissao}`)
            return data;
        }catch(err){
            throw "Não foi possível carregar as inscrições.";
        }
    }

    async function abrirCadernoAdmitidos(comissao: number, comites: Comite[]){
        try{
            const inscricoes = await carregarInscricoes(CADERNO.ADMITIDO, comissao);
            
            if(inscricoes.length === 0)
                throw 'Caderno indisponível';
            
            const comite = comites.find(c => c.committee_id === comissao);
            const capa = url(comite.capa_proposta_admitida || ambiente.CAPA_GENERICA_CADERNO);

            const blob = await gerarCaderno({
                ambiente,
                inscricoes,
                comites, 
                titulo: 'Caderno Preliminar', 
                preliminar: true, 
                exibir: {
                    justificativas: true,
                    cargos: false,
                    datas: false,
                    nomes: false
                },
                gerarBlob: true,
                capa
            }) as Blob;

            const fileCaderno = new File([blob], "caderno-1.pdf", {type: "application/pdf" });

            return fileCaderno;
        }catch(err){
            exibirNotificacao({
                titulo: "Não foi possível abrir o caderno.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        }
    }

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

    // Antes de notificar os proponentes, salva os pdf's dos cadernos no servidor.
    // Isto porque os cadernos são gerados no cliente, e os e-mails no servidor.
    async function notificar(e){
        e.preventDefault();

        try{
            // carrega todos as comissões.
            const comites = await carregarComissoes();

            // define o objeto que irá conter a relação entre comissão e caderno.
            const cadernos = {};

            for(let comite of comites){
                const formData = new FormData();

                // cria o blob do pdf do caderno
                const fileCaderno = await abrirCadernoAdmitidos(comite.committee_id, comites);
                formData.append(`valor`, fileCaderno);

                // salva o arquivo no servidor
                const {data} = await api.post("/api/arquivo", formData, {
                    headers: {
                        'Content-Type': `multipart/form-data`,
                    }
                });

                // guarda qual arquivo corresponde a cada comissão.
                cadernos[comite.committee_id] = data;
            }

            // manda o servidor notificar os proponentes.
            await api.post("/api/proponente/notificar", {
                cadernos
            });
            
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