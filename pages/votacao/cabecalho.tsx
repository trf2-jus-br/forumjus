import React, { CSSProperties } from "react";

function Cabecalho(){
    return <div className='flex d-flex flex-column align-items-center' style={{height: '', opacity: 1}}>
        <div className='d-flex align-items-center align-self-center m-2 mt-3'>
            <img className="votacao-icone" src='/justica-federal.jpg' style={e.iconeJusticaFederal} />
            <div style={{textAlign: 'start'}}>
                <h2 className="votacao-titulo" style={e.txtJornada}>I Jornada de Direitos Humanos e Fundamentais da</h2>
                <h2 className="votacao-titulo" style={e.txtJornada}>Justiça Federal da 2ª Região</h2>
            </div>
        </div>
        <hr className='w-100' />
    </div>
}

const e: {[key: string] : CSSProperties} = {
    iconeJusticaFederal : {
    },
    txtJornada: {
        marginBottom: 0,
        fontFamily: 'calibri',
        color: '#868686',
        fontSize: 25,
        textTransform: 'uppercase',
    }
}

export default Cabecalho;