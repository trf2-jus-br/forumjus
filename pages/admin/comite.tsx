import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function Comite (props: Props){
    return <CRUD 
        nome='Comissões' 
        colunas={[
            {nome: "ID", banco: "committee_id", largura: 1, exibir: true},
            {nome: "Jornada", banco: "forum_id", largura: 1},
            {nome: "Nome", banco: "committee_name", largura: 3, exibir: true},
            {nome: "Presidente", banco: "committee_chair_name", largura: 1},
            {nome: "Documento Presidente", banco: "committee_chair_document", largura: 1},
            {nome: "Descrição", banco: "committee_description", largura: 6, exibir: true},
        ]}
        api="/api/crud?tabela=committee&nome_id=committee_id"
    />
}


export default comPermissao(Comite, "PROGRAMADOR");