import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { usarContexto } from '../../contexto';
import { Autocomplete, TextField } from '@mui/material';
import { formatarCodigo } from '../admissao/enunciado';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { retornoAPI } from '../../utils/api-retorno';

type EnunciadoJuncao = Enunciado & {
    juncao: number,
    juncao_texto: string,
    juncao_justificativa: string
}

function validar(valor: string, limite: number){
    if(valor.length === 0)
        return "Não pode ser vazio";

    if(valor.length > limite)
        return `Texto contém ${valor.length} /  ${limite} caracteres.`;
}

function JuntarEnunciados(){
    const [ enunciados, setEnunciados ] = useState<EnunciadoJuncao[]>([]);
    const [ juntados, setJuntados] = useState<EnunciadoJuncao[]>([]);
    const [texto, setTexto] = useState<string>();
    const [justificativa, setJustificativa] = useState<string>();

    const { api, exibirNotificacao } = usarContexto();

    async function carregar(){
        try{
            setJuntados([])

            const {data} = await api.get<EnunciadoJuncao[]>('/api/enunciado/juntar');
            setEnunciados(data
                .filter(e => e.codigo != null)
                .sort((a, b) => formatarCodigo(a) > formatarCodigo(b) ? 1 : -1)
            );
        }catch(err){

        }
    }   

    async function salvar(){
        try{
            const err = validar(justificativa, 1600) || validar(texto, 800);

            if(err)
                return exibirNotificacao({ texto: err, tipo: "ERRO"})

            await api.put(`/api/enunciado/juntar`, {
                juncao : juntados[0].juncao, 
                codigo: juntados[0].codigo, 
                texto, 
                justificativa,
                comite: juntados[0].committee_id,  
                enunciados: juntados.map(e => e.statement_id)
            });

            carregar();

            exibirNotificacao({texto: "Enunciado atualizado com sucesso!"})
        }catch(err){
            // Avise sobre o erro.
            const texto = retornoAPI(err);
            exibirNotificacao({titulo: "Erro ao processar solicitação.",texto,tipo: "ERRO"})
        }
    }

    function juntar(enunciado: EnunciadoJuncao){
        // ignora o evento gerado por limpar a caixa de seleção
        if(!enunciado)
            return;
        
        // ignora elementos duplicados
        if(juntados.find(e => e.statement_id === enunciado.statement_id))
            return;

        // define o texto padrão, ao selecionar o primeiro enunciado.
        if(!texto){
            setTexto(enunciado.juncao_texto || enunciado.statement_text); 
            setJustificativa(enunciado.juncao_justificativa ||enunciado.statement_justification); 
        }

        if(enunciado.juncao != null){
            setJuntados([...juntados, ...enunciados.filter(e => e.juncao === enunciado.juncao)]);
        }else{
            setJuntados([...juntados, enunciado]);
        }
    }

    function remover(indice){
        setJuntados(j => {
            j.splice(indice, 1);
            return [...j];
        });
    }

    useEffect(() => {
        carregar();
    }, [])


    useEffect(()=>{
        const id = parseInt(
            new URLSearchParams(window.location.search).get("id")
        );

        if(enunciados?.length > 0 && Number.isInteger(id)) {
            juntar( enunciados.find(({statement_id}) =>  statement_id == id) );
        }
    }, [enunciados])

    console.log(juntados)

    return <Layout>
        <Autocomplete
            size='small'
            className='col-12 mb-3'
            disablePortal
            id="combo-box-demo"
            options={enunciados.map(m => ({...m, key: m.statement_id, label: `${formatarCodigo(m)} - #${m.statement_text.slice(0, 50)}`  }))}
            renderInput={(params) => <TextField {...params} label="Enunciado" />}
            onChange={(event, value)=> juntar(value)}
        />

        <Table striped>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Enunciado</th>
                    <th>Justificativa</th>
                    <th></th>
                </tr>
            </thead>
            <tbody style={{verticalAlign: 'middle', textAlign: 'justify'}}>
                {juntados.map( (j, i) => <tr key={j.statement_id}>
                    <td>{formatarCodigo(j)}</td>
                    <td>{j.statement_text}</td>
                    <td>{j.statement_justification}</td>
                    <td>
                        <Button onClick={() => remover(i)} size='sm' variant='danger'>x</Button>
                    </td>
                </tr>)}
            </tbody>
        </Table>

            
        {juntados.length > 0 && <>
            <h6>Redação final</h6>
            <div className='row p-3'>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Enunciado</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows="8" 
                        value={texto} 
                        onChange={(evt, i) => setTexto(evt.target.value)} 
                        isInvalid={texto.length == 0 || texto.length > 800} 
                    />
                    <Form.Control.Feedback type="invalid">{validar(texto, 800)}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Justificativa</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows="8" 
                        value={justificativa} 
                        onChange={(evt, i) => setJustificativa(evt.target.value)} 
                        isInvalid={justificativa.length == 0 || justificativa.length > 1600} 
                    />
                    <Form.Control.Feedback type="invalid">{validar(justificativa, 1600)}</Form.Control.Feedback>
                </Form.Group>
            </div>
            <Button disabled={juntados.length < 2} onClick={salvar}>Salvar</Button>
        </>}
    </Layout>
}

export default JuntarEnunciados;