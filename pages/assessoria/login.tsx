import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { usarContexto } from '../../contexto';

function Login(props){
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    
    const { api } = usarContexto();

    async function logar(event: FormEvent){
        event.preventDefault();

        try{
            const auth = 'Basic ' + btoa(matricula.toUpperCase() + ':' + senha)
            
            const {data: usuario} = await api.post<Usuario>(`/api/login`, null, {
                headers: {
                    Authorization: auth
                }
            })

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

    useEffect(()=>{
        try{
            api.delete('/api/login')
        }catch(err){
            alert("Não possível encerrar a sessão anterior.")
        }
    }, [])

    return (
        <div className="container content">
          <div className="px-4 py-5 my-5 text-center">
            <div className="col-lg-6 mx-auto">
                <img className='w-100' src="/saia.png" />

                <form onSubmit={(event) => logar(event)}>
                    <Form.Control placeholder='Matricula SIGA' className='mt-5 w-100 text-center' type='input' value={matricula} onChange={e => setMatricula(e.target.value)}></Form.Control>
                    <Form.Control placeholder='Senha SIGA' className='mt-1 w-100 text-center' type='password' value={senha} onChange={e => setSenha(e.target.value)}></Form.Control>
                    <Button type='submit' className="mt-2 w-100">Entrar</Button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Login;