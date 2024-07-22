import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function Arquivo (props: Props){
    return <CRUD 
        nome='Arquivo' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Mime Type", banco: "tipo", largura: 4, exibir: true},
            {nome: "Caminho", banco: "caminho", largura: 8, exibir: true},
        ]}
        api="/api/crud?tabela=arquivo&nome_id=id"
    />
}


export default comPermissao(Arquivo, "PROGRAMADOR");