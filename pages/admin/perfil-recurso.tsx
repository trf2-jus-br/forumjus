import React from 'react';
import CRUD from '../../components/crud';
import comPermissao from '../../utils/com-permissao';

interface Props {

}

function PerfilRecurso (props: Props){
    return <CRUD 
        nome='Relação de Perfis e Recursos' 
        colunas={[
            {nome: "ID", banco: "id", largura: 1, exibir: true},
            {nome: "Perfil", banco: "perfil", largura: 4, exibir: true},
            {nome: "Recurso", banco: "recurso", largura: 4, exibir: true},
        ]}
        api="/api/crud?tabela=perfil_recurso&nome_id=id"
    />
}


export default comPermissao(PerfilRecurso, "PROGRAMADOR");