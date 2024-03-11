import React, { CSSProperties, useEffect, useState } from 'react';


function Encerramento(){
    const [escala, setEscala] = useState(1);
    const [opacidade, setOpacidade] = useState(0);

    function esperar(milisegundos: number){
        return new Promise((resolve, reject)=>{
            setTimeout(resolve, milisegundos);
        });
    }

    async function exibir(){
        await esperar(250);
        setOpacidade(1);
    }

    useEffect(()=>{
        const interval = setInterval(async () => {
            setEscala(0.95);
            await esperar(1000);
            setEscala(1.05);
        }, 2000);

        exibir();

        return ()=> clearInterval(interval);
    }, [])

    return <div className="text-center" style={{opacity: opacidade, transition: 'all 2s'}}>
        <h1 style={{fontSize: 55, fontFamily: 'calibri', color: '#868686', marginTop: 225}}>Obrigado por sua contribuição</h1>
        <h4 style={{marginTop: 25, transform: `scale(${escala})` , transition: 'all 2s'}}>As atividades retornam amanhã às 14h</h4>
    </div> 
}

const e: {[key: string] : CSSProperties} = {
    iconeJusticaFederal : {
        opacity: 1,
        width: 80,
        marginRight: 20,
    },
    txtJornada: {
        marginBottom: 0,
        fontFamily: 'calibri',
        color: '#868686',
        fontSize: 37,
        textTransform: 'uppercase',
    }
}

export default Encerramento;