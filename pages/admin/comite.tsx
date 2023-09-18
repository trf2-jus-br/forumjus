import React from 'react';
import CRUD from '../../components/crud';

interface Props {

}

function Comite (props: Props){
    return <CRUD 
        nome='Comitês' 
        colunas={[
            {nome: "ID", banco: "committee_id", largura: 1, exibir: true},
            {nome: "Fórum", banco: "forum_id", largura: 1},
            {nome: "Nome", banco: "committee_name", largura: 3, exibir: true},
            {nome: "Presidente", banco: "committee_chair_name", largura: 1},
            {nome: "Documento Presidente", banco: "committee_chair_document", largura: 1},
            {nome: "Descrição", banco: "committee_description", largura: 6, exibir: true},
        ]}
        api="/api/crud?tabela=committee&nome_id=committee_id"
    />
}


export default Comite;