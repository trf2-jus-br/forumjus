import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { usarContexto } from "../../contexto";
import moment from "moment";

interface Props {
    id: number
}

function acao(log: Log){
    if(log.acao === "analisar enunciado")
        return log.detalhes.admitido ? 'Admitiu' : 'Rejeitou';

    if(log.acao === "desfazer analise")
        return "Desfez a análise";
    
    return log.acao;
}

function Registro({id} : Props){
    const [logs, setLogs] = useState<Log[]>([]);

    const { api } = usarContexto();

    useEffect(()=>{
        api.get<Log[]>(`/api/enunciado/log?id=${id}`)
        .then( ({data}) => setLogs(data))
        .catch(e => {});
    }, [])

    return <Table striped>
    <thead>
        <tr>
            <th>Ação</th>
            <th className='text-center'>Inscrições</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {logs?.map( c => <tr style={{cursor:'pointer'}} key={c.id} >
            <td style={{textTransform: "initial"}}>{acao(c)}</td>
            <td className='text-center' >{c.usuario}</td>
            <td>{moment(c.data).format('DD/MM/YY HH:mm') }</td>
        </tr>)}
    </tbody>
</Table>
}

export default Registro;