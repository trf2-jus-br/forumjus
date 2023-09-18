import React from 'react';
import { Button, Card } from 'react-bootstrap';

import type { CRUD } from '../../components/crud/crud';

interface Props {
    comite: CRUD.Comite
}

function Comite({ comite} : Props){
    return (
        <Card className="m-3" style={{maxWidth: 400, width:"100%", height: 125}}>
            <span style={e.enunciados}>{comite.committee_name.length} enunciados</span>
            <Card.Body className='d-flex text-center align-items-center justify-content-center'>
                {comite.committee_name}
            </Card.Body>

            <a href={`/votacao/${comite.committee_id}`} style={{position:'absolute', bottom: 0, alignSelf: "center", transform: "translateY(40%)"}}>
                <Button className='btn-success' >VOTAR</Button>
            </a>
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
    }
}

export default Comite;