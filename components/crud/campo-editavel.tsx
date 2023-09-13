import React, {useState} from 'react';

import type {CRUD} from './crud'
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';

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
        const usuario = document.getElementById("USUARIO_TEMP").value

        fetch(api, { 
            method: "PATCH",
            body: JSON.stringify({
                linha,
                coluna: coluna.banco,
                valor,
                usuario,
            })
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

    const editando = valor !== valorInicial;

    return (
        <td id={coluna.banco}>
            <InputGroup>
                <Form.Control className='text-center' size='sm' value={valor} onChange={e => setValor(e.target.value)} />
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