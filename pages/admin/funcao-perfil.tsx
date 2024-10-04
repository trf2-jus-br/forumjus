import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function FuncaoPerfil (props: Props){
    return <CRUD 
        nome='Relação de Funções e Perfis' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Função", banco: "funcao", largura: 4, exibir: true},
            {nome: "Perfil", banco: "perfil", largura: 4, exibir: true},
        ]}
        api="/api/crud?tabela=funcao_perfil&nome_id=id"
    />
}


export default comPermissao(FuncaoPerfil, "PROGRAMADOR");