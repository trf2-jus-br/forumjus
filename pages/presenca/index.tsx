import React, { useEffect, useState } from 'react';
import { usarContexto } from '../../contexto';
import Layout from '../../components/layout';

function Presenca(){
    const [membros, setMembros] = useState<Membro[]>([]);

    const { api } = usarContexto();

    useEffect(()=>{
        api.get<Membro[]>('api/membro').then(({data}) => setMembros(data.filter(m => m.comite === 1)));
    }, [])
    

    function entrada(id: number){
        api.post('api/presenca', {id});
    }

    function saida(id: number){
        api.delete(`api/presenca?id=${id}`);
    }

    return <Layout>
        {membros.map(m => <div>
            {m.id} {m.nome}
            <button onClick={() => entrada(m.id)} >+</button>
            <button onClick={() => saida(m.id)}>-</button>
        </div>)}
    </Layout>;
}

export default Presenca;