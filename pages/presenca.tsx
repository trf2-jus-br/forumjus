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

    /*
    function limpaSugestoeoesAutocompletar(){
        //setMembros([]); //Limpa lista de sugestões
        //carregarMembros(); //Atualiza se usuario apagar o que digitou
    }
    */

    function cadastrarPresenca(membro) {
      //limpaSugestoeoesAutocompletar()
      const presenca = {
          membroId: membro.id,
          dia: '1ª VOTAÇÃO' // ou '2ª VOTAÇÃO', dependendo da lógica
      };

      api.post('/api/presenca', presenca).then(response => {
          exibirNotificacao({
              titulo: "Presença cadastrada com sucesso",
              texto: "A presença foi cadastrada com sucesso.",
              tipo: "SUCESSO"    
          });
      }).catch(err => {
          exibirNotificacao({
              titulo: "Não foi possível cadastrar a presença",
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
