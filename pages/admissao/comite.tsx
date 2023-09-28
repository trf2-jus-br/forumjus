import React from 'react';
import { Button, Card } from 'react-bootstrap';


type DetalheComite = Comite & {
    enunciados : number
}

interface Props {
    comite: DetalheComite
}

function Comite({ comite} : Props){

    function abrir(){
        window.location.href = `/admissao/${comite.committee_id}`
    }

    return (
        <Card onClick={abrir} className="m-3" style={e.card}>
            <span style={e.enunciados}>{comite.enunciados} enunciados</span>
            <Card.Body className='d-flex text-center align-items-center justify-content-center'>
                {comite.committee_name}
            </Card.Body>
        </Card>
    )
}

const e = {
    enunciados : {
        position: "absolute",
        bottom: 0,
        right: 5,
        fontWeight: 600,
        fontSize: 14,
    },
    card: {
        maxWidth: 400, 
        width:"100%", 
        height: 125,
        cursor: 'pointer'
    }
}

export default Comite;