import React from 'react';
import CRUD from '../../components/crud';

interface Props {

}

function Comissao (props: Props){
    return <CRUD 
        nome='Permissões' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Nome", banco: "nome", largura: 1, exibir: true},
            {nome: "Usuarios", banco: "usuarios", largura: 1, exibir: true},
            {nome: "Permissoes", banco: "permissoes", largura: 1, exibir: true},
        ]}
        api="/api/crud?tabela=permissao&nome_id=id"
    />
}

export default Comissao;