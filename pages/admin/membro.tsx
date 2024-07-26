import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function Membro (props: Props){
    return <CRUD 
        nome='Membro' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Nome", banco: "nome", largura: 3, exibir: true},
            {nome: "Função", banco: "funcao", largura: 2, exibir: true},
            {nome: "Comissão", banco: "comite", largura: 1, exibir: true},
            {nome: "Token", banco: "token", largura: 8, exibir: false},
            {nome: "Proponente", banco: "proponente", largura: 1, exibir: true},
        ]}
        linhas={[
        ]}
        api="/api/crud?tabela=membro&nome_id=id"
    />
}


export default comPermissao(Membro, "PROGRAMADOR");