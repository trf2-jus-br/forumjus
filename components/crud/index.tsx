import React, { useEffect, useRef, useState } from 'react';

import type { CRUD } from './crud';
import Layout from '../layout';
import CampoEditavel from './campo-editavel';
import { Breadcrumb, Button, Dropdown, DropdownButton, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import { usarContexto } from '../../contexto';


function CRUD (props : CRUD.Props){
    const {
        nome,
        colunas,
        api,
        linhas
    } = props;

    const [dados, setDados] = useState([]);
    const [colunasVisiveis, setColunasVisiveis] = useState<boolean[]>( colunas.map( e => e.exibir) );
    const [criando, setCriando] = useState(false);

    const formikRef = useRef(null);


    const {usuario} = usarContexto();
    const possui_permissao = usuario?.permissoes?.crud;  


    function carregar(){
        if(!possui_permissao){
            return alert(`${usuario?.nome || ''} não possui permissão para acessar essa tela.` )
        }

        fetch(api)
        .then( async response => {
            if(!response.ok)
                throw response.statusText;

            setDados(await response.json())
        })
        .catch( err => alert(err))
    }

    useEffect(()=>{
        carregar();
    }, [])

    function filtrar(indice: number, checked: boolean){
        colunasVisiveis[indice] = checked;
        setColunasVisiveis([...colunasVisiveis]);
    }

    function excluir(linha){
        const formData = new FormData();
        formData.append('linha', JSON.stringify(linha));

        if(window.confirm(`O item será deletado. Essa ação não pode ser desfeita.`)){
            fetch(api, {
                method: "DELETE",
                body: formData
            })
            .then(response =>{
                if(!response.ok)
                    throw response.statusText;

                carregar();
            })
            .catch(err => alert(err));
        }
    }

    function criar(valores){
        const formData = new FormData();

        Object.keys(valores).forEach(k => {
            const valor = valores[k]

            if(valor && valor instanceof File){
                formData.append(k, valor, valor.name);
            }else{
                formData.append(k, JSON.stringify(valor));
            }
        })

        fetch(api, {
            method: 'POST',
            body: formData
        })
        .then( res => {
            if(!res.ok)
                throw res.statusText;

            carregar();
            setCriando(false)
        })
        .catch(err => alert(err));
    }

    if(!possui_permissao){
        return <></>;
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between">
                <div className='d-flex align-items-center'>
                    <Breadcrumb>
                        <Breadcrumb.Item href='/admin'>Administração</Breadcrumb.Item>
                        <Breadcrumb.Item active>
                            {nome}
                            <Button style={{marginLeft: 10}} size='sm' title='Adicionar' onClick={()=> setCriando(true)}>+</Button>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    
                </div>
                <DropdownButton size='sm' autoClose="outside" title="Colunas">
                    {colunas.map( (coluna, indice) => (
                        <Dropdown.Item key={coluna.nome} className='d-flex user-select-none' as="label" >
                            <Form.Check onChange={(event)=> filtrar(indice, event.target.checked)} checked={colunasVisiveis[indice]} type='switch'/>{coluna.nome}
                        </Dropdown.Item>    
                    ))}
                </DropdownButton>
            </div>
            <table className='table table-hover table-light text-center'>
                <thead className='thead-dark'>
                    <tr className='align-middle'>
                        { colunas.filter((e, indice) => colunasVisiveis[indice]).map(({nome, largura}) => <th key={nome} className={`col-${largura}`}>{nome}</th>) }      
                        <th key={nome} className={`col-1`}></th>                  
                    </tr>
                </thead>
                <tbody>
                    {dados.map( (linha, indice_linha) => <tr className='align-middle' key={indice_linha + Math.random()}>
                            { colunas.filter((e, indice) => colunasVisiveis[indice]).map( coluna => {
                                const linha_especial = linhas?.find(l => l.identificador_valor == linha[l.identificador_nome] && l.coluna === coluna.banco);
                                return <CampoEditavel key={`${coluna.nome}`} api={api} coluna={coluna} linha={linha} tipo={linha_especial?.tipo || coluna.tipo} />
                            }) }
                            <td>
                                <Button size='sm' variant="outline-danger"  onClick={() => excluir(linha)}>
                                    <FontAwesomeIcon className='d-inline' title='Excluir' icon={faTrash} />
                                </Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Formik innerRef={formikRef} initialValues={{}} onSubmit={criar}>
                {({handleChange, handleSubmit}) =>(
                    <Modal show={criando} onHide={() => setCriando(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{nome}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {colunas.map( coluna => <Form.Group key={coluna.banco} controlId={coluna.banco}>
                                    <Form.Label>{coluna.nome}</Form.Label>
                                    <Form.Control className='text-center' size='sm' onChange={handleChange} />
                                </Form.Group>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={()=> handleSubmit()}>Criar</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Formik>
                

        </Layout>
    );
}

export default CRUD;