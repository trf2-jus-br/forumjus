import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { Breadcrumb, Button, Form, Modal } from 'react-bootstrap';
import { usarContexto } from '../../contexto';
import { retornoAPI } from '../../utils/api-retorno';

function EditarRedacaoEnunciado(){
    const [enunciado, setEnunciado] = useState<Enunciado>();
    const [texto, setTexto] = useState<string>();
    const [justificativa, setJustificativa] = useState<string>();

    const  { api, exibirNotificacao } = usarContexto();

    async function carregar(){
        try{
            const id = parseInt(
                new URLSearchParams(window.location.search).get("id")
            );
            
            const {data} = await api.get<Enunciado>(`/api/enunciado?id=${id}`);
            setEnunciado(data);
            setTexto(data.statement_text);
            setJustificativa(data.statement_justification);
        }catch(err){
            // Avise sobre o erro.
            const texto = retornoAPI(err);
            exibirNotificacao({titulo: "Nãoo foi possível carregar os enunciados.", texto, tipo: "ERRO"})
        }
    }

    async function salvar(){
        try{
            const err = validar(justificativa, 1600) || validar(texto, 800);
            if(err)
                return exibirNotificacao({ texto: err, tipo: "ERRO"})

            await api.put(`/api/enunciado/editar-redacao`, {
                id: enunciado.statement_id,
                texto,
                justificativa
            });

            exibirNotificacao({texto: "Enunciado atualizado com sucesso!"})
        }catch(err){
            // Avise sobre o erro.
            const texto = retornoAPI(err);
            exibirNotificacao({titulo: "Erro ao processar solicitação.",texto,tipo: "ERRO"})
        }
    }

    useEffect(()=>{
        carregar();
    }, [])

    function validar(valor: string, limite: number){
        if(valor.length === 0)
            return "Não pode ser vazio";

        if(valor.length > limite)
            return `Texto contém ${valor.length} /  ${limite} caracteres.`;
    }

    return (
        <Layout>
            <Breadcrumb>
                <Breadcrumb.Item active>Editar Redação</Breadcrumb.Item>
                {enunciado && <Modal size='xl' show={true}>

                    <Modal.Header closeButton>
                        <Modal.Title>Editar enunciado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Enunciado</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows="7" 
                                value={texto} 
                                onChange={(evt, i) => setTexto(evt.target.value)} 
                                isInvalid={texto.length == 0 || texto.length > 800} 
                            />
                            <Form.Control.Feedback type="invalid">{validar(texto, 800)}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Justificativa</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows="12" 
                                value={justificativa} 
                                onChange={(evt, i) => setJustificativa(evt.target.value)} 
                                isInvalid={justificativa.length == 0 || justificativa.length > 1600} 
                            />
                            <Form.Control.Feedback type="invalid">{validar(justificativa, 1600)}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={salvar}>Salvar</Button>
                    </Modal.Footer>
                </Modal>}
            </Breadcrumb>
        </Layout>
    )
}

export default EditarRedacaoEnunciado;