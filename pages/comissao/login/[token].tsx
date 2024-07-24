'use client'

import React, { useEffect } from 'react';

// @ts-ignore
import { useRouter } from 'next/router'
import { usarContexto } from '../../../contexto';
import moment from 'moment';

function Login(props){
    const router = useRouter()
    const {api} = usarContexto();

    useEffect(()=>{
        const {token} = router.query;

        if(token != null && token !== ''){
            logar(token);
        }
    }, [router.query]);


    async function emVotacao(){
        const {data : calendario} = await api.get<Calendario[]>("/api/calendario");
        
        const votacaoGeral = calendario.find(c => c.evento === "VOTAÇÃO GERAL")
        const votacaoPorComissao = calendario.find(c => c.evento === "VOTAÇÃO POR COMISSÃO")

        const agora = moment();
        
        const votandoGeral = moment(votacaoGeral.inicio) < agora && agora < moment(votacaoGeral.fim);
        const votandoComissao = moment(votacaoPorComissao.inicio) < agora && agora < moment(votacaoPorComissao.fim);

        return votandoGeral || votandoComissao;
    }

    function definirRotaInicial(usuario){
        switch(usuario.funcao){
            case "ESPECIALISTA":
                case "JURISTA":
                    return '/inscricoes';
            
            case "PRESIDENTE":
                case "PRESIDENTA":
                    case "RELATOR":
                        case "RELATORA":
                            return '/admissao';
                            
            case "MEMBRO":
                return '/votacao';
            
            default:
                throw `${usuario.funcao} não deveria logar utilizando token.`;
        }
    }

    async function logar(token?: string){
        try{
            const resposta = await fetch(`/api/login?cracha=${token != null}`, {
                method: 'POST',
                headers: {
                    Authorization: token
                }
            })

            if(!resposta.ok){
                throw undefined;
            }

            const usuario : Usuario = await resposta.json();

            window.location.href = await emVotacao() ? '/votacao' : definirRotaInicial(usuario);
        }catch(err) {
            alert(err || "Erro ao se comunicar com servidor.");
        }
    }

    return <></>
}

export default Login;