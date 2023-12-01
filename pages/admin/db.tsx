import { Button } from "react-bootstrap";
import Layout from "../../components/layout";
import comPermissao from "../../utils/com-permissao";
import { usarContexto } from "../../contexto";
import { retornoAPI } from "../../utils/api-retorno";


function DB(props: React.PropsWithChildren){
    const { exibirNotificacao, api } = usarContexto(); 

    async function limparVotacao(){
        try{
            await api.post("/api/db?acao=limparVotacao")
            exibirNotificacao({texto: "Banco limpo!"});
        }catch(err){
            exibirNotificacao({texto: retornoAPI(err), tipo: "ERRO"});
        }
    }

    
    async function iniciarVotacaoGeral(){
        try{
            await api.post("/api/db?acao=iniciarVotacaoGeral")
            exibirNotificacao({texto: "Votação Geral Iniciada!"});
        }catch(err){
            exibirNotificacao({texto: retornoAPI(err), tipo: "ERRO"});
        }
    }

    
    async function iniciarVotacaoPorComissao(){
        try{
            await api.post("/api/db?acao=iniciarVotacaoPorComissao")
            exibirNotificacao({texto: "Votação por Comissão Iniciada!"});
        }catch(err){
            exibirNotificacao({texto: retornoAPI(err), tipo: "ERRO"});
        }
    }

    return <Layout>
        <div className="justify-content-evenly w-100 d-flex">
            <Button onClick={iniciarVotacaoPorComissao}>Iniciar votação por comissão</Button>
            <Button onClick={iniciarVotacaoGeral}>Iniciar votação geral</Button>
            <Button onClick={limparVotacao}>Limpar votações</Button>
        </div>
    </Layout>
}

export default comPermissao(DB, "PROGRAMADOR");