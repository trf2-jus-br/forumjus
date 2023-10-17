import React from 'react';
import CRUD from '../../components/crud';

interface Props {

}

function Comissao (props: Props){
    return <CRUD 
        nome='Enunciados' 
        colunas={[
            {nome: "ID", banco: "statement_id", largura: 1, exibir: true},
            {nome: "Jornada", banco: "forum_id", largura: 1, exibir: true},
            {nome: "Participante", banco: "attendee_id", largura: 1, exibir: true},
            {nome: "Comitê", banco: "committee_id", largura: 1, exibir: true},
            {nome: "Título", banco: "statement_text", largura: 4, exibir: true},
            {nome: "Justificativa", banco: "statement_justification", largura: 4, exibir: true},
            {nome: "Se foi admitido", banco: "admitido", largura: 3, exibir: true},
        ]}
        api="/api/crud?tabela=statement&nome_id=statement_id"
    />
}


export default Comissao;