import React, { useEffect, useState } from 'react';

interface Props {
    atual : number;
    id : number;
    bloco?: boolean;
    className?: string;
}

function Passo({children, id, atual, bloco, className} : React.PropsWithChildren<Props>){
    const classe = atual >= id ? 'opacity-100' : 'opacity-0'

    const visivel = !bloco ? '' : atual - id > 4 ? 'bloco-oculto' : 'bloco-visivel';
 
    return <div className={`resumo-jornada-passo ${classe} ${visivel} ${className || ''}`} style={{overflow: 'hidden'}}>
        {children}
    </div>
}

export default Passo;