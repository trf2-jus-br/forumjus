import React from 'react';
import { Button, Card } from 'react-bootstrap';


interface Props {
    comite: DetalheComite
}

function Comite({ comite} : Props){

    function abrir(){
        window.location.href = `/inscricoes?comite=${comite.committee_id}`
    }

    return (
        <div className='col-12 col-lg-6'>
            <Card onClick={abrir} className="mt-2 mb-2" style={e.card}>
                <span style={e.enunciados}>{comite.enunciados} enunciados</span>
                <Card.Body className='d-flex text-center align-items-center justify-content-center'>
                    {comite.committee_name}
                </Card.Body>
            </Card>
        </div>
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
        width:"100%", 
        height: 125,
        cursor: 'pointer'
    }
}

export default Comite;