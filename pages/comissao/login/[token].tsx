'use client'

import React, { useEffect, useState } from 'react';

// @ts-ignore
import { useRouter } from 'next/router'

function Login(props){
    const router = useRouter()

    useEffect(()=>{
        const {token} = router.query;

        if(token != null && token !== ''){
            logar(token);
        }
    }, [router.query]);

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

        switch(usuario.funcao){
            case "ESPECIALISTA":
                case "JURISTA":
                    window.location.href = '/inscricoes';
                    break;
            
            case "PRESIDENTE":
                case "PRESIDENTA":
                    case "RELATOR":
                        case "RELATORA":
                            window.location.href = '/admissao';
                            break;
                            
            case "MEMBRO":
                window.location.href = '/votacao';
                break;
            
            default:
                alert(`${usuario.funcao} não deveria logar utilizando token.`);
        }
      }catch(err) {
        alert(err || "Erro ao se comunicar com servidor.");
      }
    }

    return <></>
}

export default Login;