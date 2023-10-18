import React, { useEffect, useState, useContext, useRef } from 'react';
import cookie from 'cookie';
import axios from 'axios';
import ModalError from '../components/modalError'

const contexto = React.createContext<Contexto>(null);

// define as página que podem ser acessadas sem login.
const paginas_publicas = [
    "/assessoria/login", '/', '/register', '/comissao/login/.*'
]

export function ContextoProvider({children}){
    const [usuario, setUsuario] = useState<Usuario>(null);
    const [forum, setForum] = useState<Forum>(null);
    const [carregando, setCarregando] = useState(true);
    const mensagemRef = useRef(null)

    const api = axios.create()

    api.interceptors.response.use(
        function (response) {
            return response;
        }, 
        function (error) {
            // Intercepta todas as requisições 403
            if(error?.response?.status === 403 && window.location.pathname !== '/assessoria/login'){
                // Notifica que a sessão expirou e redireciona para página de login.
                mensagemRef.current.exibir({
                    texto: 'Sessão expirada', 
                    titulo: 'Sessão expirada##',
                    acao:  ()=> window.location.href = '/assessoria/login'
                })

                // Ignora o tratamento original da requisição.
                return new Promise(()=>{});
            } else{
                return Promise.reject(error);
            }
        }
    );

    function exibirNotificacao(msg: Mensagem){
        mensagemRef.current.exibir(msg)
    }

    async function carregar(){
        try{
            const { data } = await api.get<Forum>('/api/forum');
            setForum(data)
        }catch(err){
            alert(err);
        }

        // carrega do cookie as informações do usuário, se ele estiver logado.
        const { forum_usuario } = cookie.parse(document.cookie);
        
        // valida se url digitada é uma das públicas.
        const eh_pagina_publica = paginas_publicas.some( p => window.location.pathname.match(`^${p}$`) );

        // salva no contexto as informações do usuário.
        if(forum_usuario){
            setUsuario( JSON.parse(forum_usuario))
        }else if(!eh_pagina_publica){
            // redireciona pro login, caso a página seja privada e não tenha nenhum usuário logado.
            window.location.href = "/assessoria/login"
            return undefined;
        }
        
        setCarregando(false)
    }

    useEffect(()=>{
        carregar();
    }, [])


    if(carregando)
        return <></>;

    return <contexto.Provider value={{usuario, forum, exibirNotificacao, api}}>
        {children}
        <ModalError ref={mensagemRef} title="Atenção" />
    </contexto.Provider>
}

export function usarContexto(){
    return useContext(contexto);
}