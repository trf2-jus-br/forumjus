import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function Login(props){
    const [doc, setDoc] = useState("");
    const [nome, setNome] = useState("");

    function logar(){
        //document.cookie=`doc=${doc.trim()}`
        //document.cookie=`nome=${nome.trim()}`

        //window.location.href = '/votacao'
    }

    return (
        <div>
            <Form.Group className='d-flex' style={{
                    justifyContent: "center", alignItems: "center", height: "100vh",
                    width: "100vw", flexDirection: "column",
            }}>
                <Form.Control className='w-25 text-center' type='input' value={nome} onChange={e => setNome(e.target.value)}></Form.Control>
                <Form.Control className='w-25 text-center' type='input' value={doc} onChange={e => setDoc(e.target.value)}></Form.Control>
                <Button className="mt-2 w-25" onClick={logar}>Login</Button>
            </Form.Group>
        </div>
    )
}

export default Login;