import Layout from "../../components/layout";

function Ajuda(){
    return <Layout>
        Calendário
        <p>A jornada é composta por 4 fases. As funcionalidades disponíveis, dependem do usuário que está logado.</p>

    
        <h5>1. Inscrições</h5>
        <div className="m-2">
            <div>09/10 16:01</div>
            <div>09/10 16:01</div>
            
            <p>Qualquer pessoa pode enviar propostas de enunciados, através do link <a href="/register">registrar</a>.</p>
            <p>Ao finalizar o cadastro a pessoa receberá um email de confirmação, com cópia para forumdhf@trf2.jus.br</p>
        </div>
        
        <hr/>

        <h5>2. Pre-aprovação dos enunciados</h5>
        <div className="m-2">
            <div>09/10 16:01</div>
            <div>09/10 16:01</div>
            
            Os responsáveis por cada comissão (Presidente ou Relator) podem:
            <ul>
                <li>Aprovar enunciados</li>
                <li>Rejeitar enunciados</li>
                <li>Trocar a comissão dos enunciados</li>
            </ul>
        </div>

        <hr/>

        <h5>3. Votação por Comissão</h5>
        <div className="m-2">
            <div>09/10 16:01</div>
            <div>09/10 16:01</div>
            
            <p>As comissões irão se reunião para votar os enunciados pré-aprovados.</p>

            Os responsáveis por cada comissão (Presidente ou Relator) podem:
            <ul>
                <li>Iniciar votação</li>
                <li>Parar votação</li>
            </ul>

            Os membros de cada comissão podem:
            <ul>
                <li>Caso tenha alguma votação em andamento, poderá votar.</li>
            </ul>
        </div>


        <hr/>

        <h5>4. Votação geral</h5>
        <div className="m-2">
            <div>09/10 16:01</div>
            <div>09/10 16:01</div>
            
            <p>Todos irão se reunir para votar todos os enunciados aprovados nas votações por comissão.</p>

            Os responsáveis pelas comissões (Presidente ou Relator) podem:
            <ul>
                <li>Iniciar votação</li>
                <li>Parar votação</li>
            </ul>

            Os membros das comissões podem:
            <ul>
                <li>Caso tenha alguma votação em andamento, poderá votar.</li>
            </ul>
        </div>

        <hr/>

        <h5>Durante todo o processo</h5>
        <div className="m-2">
            <div>09/10 16:01</div>
            <div>09/10 16:01</div>
            
            Os responsáveis por cada comissão (Presidente ou Relator) podem:
            <ul>
                <li>Aprovar enunciados</li>
                <li>Rejeitar enunciados</li>
                <li>Trocar a comissão dos enunciados</li>
            </ul>
        </div>
    </Layout>
}

export default Ajuda;