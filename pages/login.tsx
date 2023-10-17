import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function Login(props){
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    
    async function logar(token?: string){
      try{
        const auth = token || 'Basic ' + btoa(matricula + ':' + senha)

        const resposta = await fetch(`/api/login?cracha=${token != null}`, {
            method: 'POST',
            headers: {
                Authorization: auth
            }
        })

        if(!resposta.ok){
            throw undefined;
        }

        const usuario : Usuario = await resposta.json();

        const {estatistica, administrar_comissoes} =  usuario.permissoes;

        if(estatistica){
            window.location.href = '/inscricoes'
        }else if(administrar_comissoes.length !== 0){
            window.location.href = '/admissao'
        }
      }catch(err) {
        alert(err || "Erro ao se comunicar com servidor.");
      }
    }

    return (
        <div>
            <Form.Group className='d-flex' style={{
                    justifyContent: "center", alignItems: "center", height: "100vh",
                    width: "100vw", flexDirection: "column",
            }}>
                <Form.Control placeholder='Matricula SIGA' className='w-25 text-center' type='input' value={matricula} onChange={e => setMatricula(e.target.value)}></Form.Control>
                <Form.Control placeholder='Senha SIGA' className='w-25 text-center' type='password' value={senha} onChange={e => setSenha(e.target.value)}></Form.Control>
                <Button className="mt-2 w-25" onClick={() => logar()}>Login</Button>
            </Form.Group>
        </div>
    )
}

export default Login;