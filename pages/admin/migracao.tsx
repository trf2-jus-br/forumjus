import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function Comissao (props: Props){
    return <CRUD 
        nome='Ambiente' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Tick", banco: "timestamp", largura: 8, exibir: true},
            {nome: "Nome", banco: "name", largura: 8, exibir: true},
        ]}
        api="/api/crud?tabela=migrations&nome_id=id"
    />
}


export default comPermissao(Comissao, "PROGRAMADOR");