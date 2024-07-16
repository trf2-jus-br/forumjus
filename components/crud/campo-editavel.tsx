import React, {useState} from 'react';

import type {CRUD} from './crud'
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import Arquivo from './arquivo';

interface Props<R> {
    coluna: CRUD.Coluna<R>,
    linha: any,
    api: string,
}

function CampoEditavel<R> (props: Props<R>){
    const {
        coluna,
        linha,
        api,
    } = props;

    const [valorInicial, setValorInicial] = useState(linha[coluna.banco]);
    const [valor, setValor] = useState(linha[coluna.banco]);

    function confirmar(){
        const formData = new FormData();

        if(valor && valor instanceof File){
            formData.append("valor", valor, valor.name);
        }else{
            formData.append("valor", valor);
        }

        formData.append("linha", JSON.stringify(linha));
        formData.append("coluna", JSON.stringify(coluna.banco));
        
        fetch(api, { 
            method: "PATCH",
            body: formData,
        }).then(response => {
            if( !response.ok)
                throw response.statusText
            
            alert("sucesso!")
                
        }).catch( e => alert(e))

        setValorInicial(valor);
    }

    function cancelar(){
        setValor(valorInicial);
    }

    function definirComponente(tipo: CRUD.Tipo){
        switch(tipo){
            case 'Arquivo':
                return Arquivo;
            
            default:
                return ({valor, setValor}) => <Form.Control className='text-center' size='sm' value={valor} onChange={e => setValor(e.target.value)} />
        }
    }

    const editando = valor !== valorInicial;

    const Componente = definirComponente(coluna.tipo);

    return (
        <td id={coluna.banco}>
            <InputGroup>
                <Componente valor={valor} setValor={setValor} />

                {editando && <>
                    <Button size='sm' variant="outline-success"  onClick={() => confirmar()}>
                        <FontAwesomeIcon className='d-inline' title='Confirmar' icon={faCheck} />
                    </Button>
                    <Button size='sm' variant="outline-danger"  onClick={cancelar} >
                        <FontAwesomeIcon className='d-inline' title='Cancelar' icon={faBan} />
                    </Button>    
                </>}
            </InputGroup>
        </td>
    )
}

export default CampoEditavel;