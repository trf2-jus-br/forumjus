import React, { useEffect, useState, useContext, useRef } from 'react';
import cookie from 'cookie';
import axios from 'axios';
import ModalError from '../components/modalError'
import Toast from './toast';
import { retornoAPI } from '../utils/api-retorno';

const contexto = React.createContext<Contexto>(null);

// define as página que podem ser acessadas sem login.
const paginas_publicas = [
    "/assessoria/login", '/', '/register', '/comissao/login/.*',
    "/faq"
]

export function ContextoProvider({children}){
    const [usuario, setUsuario] = useState<Usuario>(null);
    const [ambiente, setAmbiente] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const mensagemRef = useRef(null);
    const toastRef = useRef(null);

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
                    titulo: 'Sessão expirada',
                    acao:  ()=> window.location.href = '/assessoria/login'
                })

                // Ignora o tratamento original da requisição.
                return new Promise(()=>{});
            }

            return Promise.reject(error);
        }
    );

    function exibirNotificacao(msg: Mensagem, modal?: boolean){
        (modal === true ? mensagemRef : toastRef).current.exibir(msg)
    }

    async function carregarAmbiente(){
        try{
            const { data } = await api.get<Ambiente>('/api/ambiente');
            setAmbiente(data);
            setCarregando(false)
        }catch(err){
            // Notifica o usuário que ocorreu um erro.
            exibirNotificacao({
                titulo: "Não foi possível carregar o nome do fórum.",
                texto: retornoAPI(err),
                tipo: "ERRO"
            })

            // Tenta recarregar a tela
            setTimeout(carregarAmbiente, 1000);
        }
    }

    async function carregar(){
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
    }

    useEffect(()=>{
        carregarAmbiente();
        carregar();
    }, [])


    return <contexto.Provider value={{usuario, ambiente, exibirNotificacao, api}}>
        {carregando ? <></> : children}
        <ModalError ref={mensagemRef} title="Atenção" />
        <Toast ref={toastRef} />
    </contexto.Provider>
}

export function usarContexto(){
    return useContext(contexto);
}