import { useEffect, useState } from 'react';
import Autocomplete from '../components/Autocomplete';
import { usarContexto } from '../contexto';
import { retornoAPI } from '../utils/api-retorno';

let IdDoMembroSelecionado = null;
let comiteSelecionado = "0";

export default function Home() {
    const [membro, setMembros] = useState({});
    const [comite, setComites] = useState([]); 
    const [presencas, setPresencas] = useState([]);
    const { api, exibirNotificacao } = usarContexto();

    function carregarMembros() {
      let url = '/api/membro';
      if (comiteSelecionado) {
          url += `?comissaoId=${comiteSelecionado}`;
      }
      
      api.get(url).then(({data}) => {
          setMembros(data);
      }).catch(err => {
          console.error(err);
      });
  }

    function carregarPresencas() {
      let url = '/api/presenca';
      if (comiteSelecionado) {
          url += `?comissaoId=${comiteSelecionado}`;
      }
      api.get(url).then(({ data }) => {
          setPresencas(data);
      }).catch(err => {
          console.error(err);
      });
  }

  function carregarComites() {
    api.get('/api/comite').then(({ data }) => {
        setComites(data);
    }).catch(err => {
        exibirNotificacao({
            titulo: "Não foi possível carregar a lista de comissões.",
            texto: retornoAPI(err),
            tipo: "ERRO"    
        });
    });
  }
    useEffect(()=>{
      carregarComites()
      carregarMembros()
      carregarPresencas()

      //Atualiza a lista de presenças a cada minuto
      const interval = setInterval(() => {
        carregarPresencas();
      }, 60000);
    
      return () => clearInterval(interval);
      
    }, []);

    function cadastrarPresenca(membro_id) {
      //TODO: tirar o if e else
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
            carregarPresencas();
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

  function cadastrarSaida(membro_id) {
    if (membro_id) {
      const presenca = {
          membroId: membro_id,
          dia: '1ª VOTAÇÃO' 
          // ou '2ª VOTAÇÃO', dependendo da lógica
      }
      
      api.put('/api/presenca', presenca).then(response => {
          exibirNotificacao({
              titulo: "Presença cadastrada com sucesso",
              texto: "A presença foi cadastrada com sucesso.",
              tipo: "SUCESSO"    
          });
          carregarPresencas();
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
    cadastrarPresenca(IdDoMembroSelecionado)
  }

  function selecionarComite(event) {
    comiteSelecionado = event.target.value
    carregarMembros()
    carregarPresencas()
  }
    return <>
      <div className="container content">
        <div className="px-4 py-5 my-5 text-center">
          <div className="col-lg-6 mx-auto">
          <h1 className="mb-4 mt-4">Cadastro de Presença</h1>
          <hr></hr>
          <div className="mb-3">
            <h2 className="mb-4 mt-4">Selecione a comissão</h2>
            <select id="comissaoSelect" className="form-select" onChange={selecionarComite}>
                <option value="0">Geral</option>
                {comite.map((c, index) => (
                    <option key={index} value={c.committee_id}>{c.committee_name}</option>
                ))}
            </select>
        </div>

            <hr></hr>
            <h2 className="mb-4 mt-4">Selecione o membro</h2>
            <div className="d-grid gap-2 justify-content-sm-center">
              <div>
                  <Autocomplete dataList={membro} 
                  render={m => m.nome} 
                  onclick={m => selecionarMembro(m.id)}/>
                  {/* Botão de Presença */}
                  &nbsp;
                  &nbsp;
              </div>
              <hr></hr>
              <div>
                <h2>Lista de Presenças</h2>
                <table className="table table-striped">
                  <thead>
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Função</th>
                                        <th scope="col">Sair</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {presencas.map((presenca, index) => (
                                        <tr key={index}>
                                            <td>{presenca.nome}</td>
                                            <td>{presenca.funcao}</td>
                                            <td>
                                            <button className="btn btn-primary btn-lg px-4" 
                                            style={{ "color": "white" }} 
                                            onClick={() => cadastrarSaida(presenca.membro)}>
                                                Sair
                                            </button>
                                            </td>
                                        </tr>
                                    ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}