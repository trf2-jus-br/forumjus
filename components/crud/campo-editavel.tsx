import React, {useCallback, useMemo, useState} from 'react';

import type {CRUD} from './crud'
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import Arquivo from './arquivo';
import Data from './data';

interface Props {
    coluna: CRUD.Coluna,
    linha: any,
    api: string,
    tipo: CRUD.Tipo
}

function CampoEditavel (props: Props){
    const {
        coluna,
        linha,
        api,
        tipo
    } = props;

    const [valorInicial, setValorInicial] = useState(linha[coluna.banco]);
    const [valor, setValor] = useState(linha[coluna.banco]);

    function confirmar(){
        const formData = new FormData();

        if(valor && valor instanceof File){
            formData.append("valor", valor, valor.name);
        }else{
            formData.append("valor", JSON.stringify(valor));
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

    function definirComponente(){
        switch(tipo){
            case 'Arquivo':
                return Arquivo;
            
            case "TextArea":
                return ({valor, setValor}) => <Form.Control as="textarea" rows={10} size='sm' value={valor} onChange={e => setValor(e.target.value)} />

            case "Data":
                return Data;
    

            default:
                return ({valor, setValor}) => <Form.Control className='text-center' size='sm' value={valor} onChange={e => setValor(e.target.value)} />
        }
    }

    const editando = valor !== valorInicial;

    const Componente = useMemo(definirComponente, [tipo]);

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