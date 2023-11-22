import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { usarContexto } from '../../contexto';
import { retornoAPI } from '../../utils/api-retorno';

function Login(props){
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    
    const { api, exibirNotificacao } = usarContexto();

    async function logar(event: FormEvent){
        event.preventDefault();

        try{
            const auth = 'Basic ' + btoa(matricula.toUpperCase() + ':' + senha)
            
            await api.post<Usuario>(`/api/login`, null, {
                headers: {
                    Authorization: auth
                }
            })

            // Apenas a COSADM e a ASSESSORIA logam com as credenciais do SIGA.
            window.location.href = '/inscricoes'
        }catch(err) {
            // gambiarra para ajustar a mensagem enviada pelo siga.
            const msg = retornoAPI(err).replace('Erro no login: ', '').replace(' Tente novamente, ou clique <a href="/siga/public/app/usuario/senha/reset" class="alert-link">Esqueci minha senha</a>', '');

            // Apenas notifica o usuário que ocorreu um erro.
            // Efeito do Erro: Usuário continua deslogado, na tela de login.
            exibirNotificacao({
                titulo: 'Não foi possível logar',
                texto: msg, 
                tipo: "ERRO"
            });
        }
    }

    useEffect(()=>{
        api.delete('/api/login').catch(err => {
            // Apenas notifica o usuário que ocorreu um erro.
            // Efeito do Erro: Usuário continua logado, apesar de estar na tela de login.
            exibirNotificacao({
                titulo: `Não foi possível deslogar`, 
                texto: retornoAPI(err),
                tipo: "ERRO"
            })
        });
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