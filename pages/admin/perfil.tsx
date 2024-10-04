import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function Perfil (props: Props){
    return <CRUD 
        nome='Perfis' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Nome", banco: "nome", largura: 4, exibir: true},
            {nome: "Descrição", banco: "descricao", largura: 8, exibir: true},
        ]}
        api="/api/crud?tabela=perfil&nome_id=id"
    />
}


export default comPermissao(Perfil, "PROGRAMADOR");