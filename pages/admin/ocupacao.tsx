import React from 'react';
import CRUD from '../../components/crud';

interface Props {

}

function Comissao (props: Props){
    return <CRUD 
        nome='Ocupações' 
        colunas={[
            {nome: "ID", banco: "occupation_id", largura: 1, exibir: true},
            {nome: "Fórum", banco: "forum_id", largura: 1, exibir: true},
            {nome: "Nome", banco: "occupation_name", largura: 8, exibir: true},
        ]}
        api="/api/crud?tabela=occupation&nome_id=occupation_id"
    />
}


export default Comissao;