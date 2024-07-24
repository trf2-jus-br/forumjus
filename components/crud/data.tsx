import moment from 'moment';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';


function formatarData(data: string){
    return moment(data).format("YYYY-MM-DD HH:mm:ss");
}

function Data({valor, setValor}){
    const [dataFormatada, setDataFormatada] = useState<string>( formatarData(valor) );

    function alterar(event){
        setValor(event.target.value);
        setDataFormatada(event.target.value);
    }

    return <Form.Control size='sm' value={dataFormatada} onChange={alterar} />
}

export default Data;