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
    }, []);

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

        const {estatistica, administrar_comissoes} =  usuario.permissoes;

        if(estatistica){
            window.location.href = '/inscricoes'
        }else if(administrar_comissoes.length !== 0){
            window.location.href = '/admissao'
        } else {
            window.location.href = '/votacao'
        }
      }catch(err) {
        alert(err || "Erro ao se comunicar com servidor.");
      }
    }

    return <></>
}

export default Login;