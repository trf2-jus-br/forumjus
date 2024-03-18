import { useEffect, useState } from 'react';
import Autocomplete from '../components/Autocomplete';
import { usarContexto } from '../contexto';
import { retornoAPI } from '../utils/api-retorno';

let IdDoMembroSelecionado = null;

export default function Home() {
    const [membro, setMembros] = useState({});
    const { api, exibirNotificacao } = usarContexto();
    function carregarMembros(){
      api.get('/api/membro').then(({data}) => {
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

    function cadastrarPresenca(membro_id) {
      if (membro_id) {
        const presenca = {
            membroId: membro_id,
            dia: '1ª VOTAÇÃO' 
            // ou '2ª VOTAÇÃO', dependendo da lógica
        }
        
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
    } else {
        exibirNotificacao({
            titulo: "Não foi possível cadastrar a presença",
            texto: "Selecione um membro para cadastrar a presença.",
            tipo: "ERRO"    
        });
    }
  }

  function selecionarMembro(id) {
    IdDoMembroSelecionado = id;
  }
  
    return (
      <div>
          <h1>Autocomplete</h1>
          <Autocomplete dataList={membro} 
          render={m => m.nome} 
          onclick={m => selecionarMembro(m.id)}/>
          {/* Botão de Presença */}
          <button onClick={
            () => cadastrarPresenca(IdDoMembroSelecionado)}>
              Cadastrar Presença
          </button>
      </div>
  );
}