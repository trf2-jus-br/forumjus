import React, { useEffect, useState, useContext } from 'react';

interface Usuario {
    nome: string,
    doc: string,
    permissoes: {
        comissoes: number [],
        crud?: number
    }
}

const UsuarioContext = React.createContext<Usuario>(null);

export function UsuarioProvider({children}){
    const [usuario, setUsuario] = useState<Usuario>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(()=>{
        const paginas_publicas = [
            "/login", '/', '/register'
        ]

        const eh_pagina_publica = paginas_publicas.some( p =>  window.location.pathname === p );

        if(usuario === null && !eh_pagina_publica){
            fetch('/api/login')
            .then(async res => {
                if(!res.ok)
                    throw res.statusText;

                setUsuario(await res.json());
            })
            .catch(err => {
                window.location.href = "/login"
            })
            .finally(()=> setCarregando(false))
        }else{
            setCarregando(false)
        }
    }, [])




    if(carregando)
        return <></>;

    return <UsuarioContext.Provider value={usuario}>
        {children}
    </UsuarioContext.Provider>
}

export function usuario(){
    return useContext(UsuarioContext);
}