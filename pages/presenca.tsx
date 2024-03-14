import { useEffect, useState } from 'react';
import Autocomplete from '../components/Autocomplete';
import { usarContexto } from '../contexto';
import { retornoAPI } from '../utils/api-retorno';

export default function Home() {
    const [membro, setMembros] = useState({});
    const { api, exibirNotificacao } = usarContexto();
    function carregarMembros(){
      api.get<Membro[]>('/api/membro').then(({data}) => {
        setMembros(data);
      }).catch(err => {
          exibirNotificacao({
            titulo: "Não foi possível carregar os dados.",
            texto: retornoAPI(err),
            tipo: "ERRO"    
          });
    
          setTimeout(carregarMembros, 4000);
      });
    }
    useEffect(()=>{carregarMembros();}, []);
    
    function limpaSugestoeoesAutocompletar(){
        //setMembros([]); //Limpa lista de sugestões
        //carregarMembros(); //Atualiza se usuario apagar o que digitou
    }

    function cadastrarPresenca(membro: Membro){
      limpaSugestoeoesAutocompletar();
      api.post<Membro>('/api/presenca', {membroId: membro.id}).then(({data}) => {
      }).catch(err => {
          exibirNotificacao({
            titulo: "Não foi possível executar o procedimento",
            texto: retornoAPI(err),
            tipo: "ERRO"    
          });
      });
    }
  
    return (
      <div>
          <h1>Autocomplete</h1>
          <Autocomplete dataList={membro} render={m => m.nome} onclick={m => cadastrarPresenca(m)}/>
      </div>
  );
}
