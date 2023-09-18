import React from 'react';
import CRUD from '../../components/crud';

interface Props {

}

function Comissao (props: Props){
    return <CRUD 
        nome='Participantes' 
        colunas={[
            {nome: "ID", banco: "attendee_id", largura: 1, exibir: true},
            {nome: "Fórum", banco: "forum_id", largura: 1, exibir: true},
            {nome: "Ocupação", banco: "occupation_id", largura: 1, exibir: true},
            {nome: "Comitê", banco: "committee_id", largura: 1, exibir: true},
            {nome: "Nome", banco: "attendee_name", largura: 1, exibir: true},
            {nome: "Nome Social", banco: "attendee_chosen_name", largura: 1, exibir: true},
            {nome: "E-mail", banco: "attendee_email", largura: 1, exibir: true},
            {nome: "Telefone", banco: "attendee_phone", largura: 1, exibir: true},
            {nome: "Documento", banco: "attendee_document", largura: 1, exibir: true},
            {nome: "Afiliação", banco: "attendee_affiliation", largura: 1, exibir: true},
            {nome: "PcD", banco: "attendee_disability", largura: 1, exibir: true},
            {nome: "Aceito", banco: "attendee_acceptance_datetime", largura: 1, exibir: true},
            {nome: "Rejeitado", banco: "attendee_rejection_datetime", largura: 1, exibir: true},
        ]}
        api="/api/crud?tabela=attendee&nome_id=attendee_id"
    />
}

export default Comissao;