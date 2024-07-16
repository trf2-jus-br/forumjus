import { faCancel, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Form } from 'react-bootstrap';

interface Props {
    valor: any;
    setValor: React.Dispatch<React.SetStateAction<any>>
}

function Arquivo({valor, setValor} : Props){
    if(!valor || typeof valor === "object")
        return <Form.Control type="file" className='text-center' size='sm' onChange={e => setValor(e.target.files[0])} />

    if(typeof valor === "string")
        return <div className='w-100 d-flex justify-content-between'>
            <a href={valor} target='_blank'>{valor}</a>
            <Button size='sm' variant="outline-primary"  onClick={() => setValor(null)} >
                <FontAwesomeIcon className='d-inline' title='Alterar arquivo' icon={faEdit} />
            </Button>      
        </div>
}

export default Arquivo;