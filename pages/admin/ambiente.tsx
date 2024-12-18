import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function Comissao (props: Props){
    return <CRUD 
        nome='Ambiente' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Nome", banco: "nome", largura: 3, exibir: true},
            {nome: "Valor", banco: "valor", largura: 8, exibir: true},
        ]}
        linhas={[
            {coluna: "valor", identificador_nome: "nome", identificador_valor: "BANNER", tipo: "Arquivo"},
            {coluna: "valor", identificador_nome: "nome", identificador_valor: "REGULAMENTO", tipo: "Arquivo"},
            {coluna: "valor", identificador_nome: "nome", identificador_valor: "CAPA_GENERICA_CADERNO", tipo: "Arquivo"},
            {coluna: "valor", identificador_nome: "nome", identificador_valor: "CRONOGRAMA_JSON", tipo: "TextArea"},
        ]}
        api="/api/crud?tabela=configuracao&nome_id=id"
    />
}


export default comPermissao(Comissao, "PROGRAMADOR");