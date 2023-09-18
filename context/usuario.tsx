import React, { useEffect, useState, useContext } from 'react';

interface Usuario {
    nome: string,
    doc: string,
    permissoes: number[]
}

const UsuarioContext = React.createContext<Usuario>(null);

export function UsuarioProvider({children}){
    const [usuario, setUsuario] = useState<Usuario>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(()=>{
        const pagina_login = window.location.pathname.indexOf("/login") !== -1;

        if(usuario === null && !pagina_login){
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