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
            {nome: "Sala", banco: "sala", largura: 3, exibir: false},
            {nome: "Capa Proposta Recebida", banco: "capa_proposta_recebida", largura: 3, exibir: false, tipo: 'Arquivo'},
            {nome: "Capa Proposta Admitida", banco: "capa_proposta_admitida", largura: 3, exibir: false, tipo: 'Arquivo'},
            {nome: "Capa Proposta Comissão", banco: "capa_proposta_comissao", largura: 3, exibir: false, tipo: 'Arquivo'},
            {nome: "Capa Proposta Plenária", banco: "capa_proposta_plenaria", largura: 3, exibir: false, tipo: 'Arquivo'},
            {nome: "Descrição", banco: "committee_description", largura: 6, exibir: true, tipo: "TextArea"},
        ]}
        api="/api/crud?tabela=committee&nome_id=committee_id"
    />
}


export default comPermissao(Comite, "PROGRAMADOR");