import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function Comissao (props: Props){
    return <CRUD 
        nome='Calendário' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Evento", banco: "evento", largura: 3, exibir: true},
            {nome: "Início", banco: "inicio", largura: 3, exibir: true},
            {nome: "Fim", banco: "fim", largura: 3, exibir: true},
        ]}
        api="/api/crud?tabela=calendario&nome_id=id"
    />
}


export default comPermissao(Comissao, "PROGRAMADOR");