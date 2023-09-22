import React from 'react';
import CRUD from '../../components/crud';

interface Props {

}

function Comissao (props: Props){
    return <CRUD 
        nome='Fóruns' 
        colunas={[
            {nome: "ID", banco: "forum_id", largura: 1, exibir: true},
            {nome: "nome", banco: "forum_name", largura: 8, exibir: true},
        ]}
        api="/api/crud?tabela=forum&nome_id=forum_id"
    />
}


export default Comissao;