# Fórumjus

Fórumjus é um sistema desenvolvido para auxiliar em Fóruns e Jornadas no âmbito do Tribunal Regional Federal da 2&ordf; Região.

Pendências
- [x] Procedimento criação ambiente local Desenvolvimento
- [x] Testar em PC zerado o procedimento criação ambiente local Desenvolvimento
- [x] Descrever as demais funcionalides
- [ ] ver a descrição de [^5]
- [ ] Finalizar preparação do sistema para uso em Evento / ver questões como receber acesso ao BD / receber acesso para atualização em homologação / criação da url a ser utilizada pelo evento, o schema/database a ser criado para ser utilizado pelo evento, e sua configuração. Muito provavelmente juntar na seção preparação do sistema para uso em Evento
- [ ] Detalhar com informações mais práticas o Procedimento para implantação (utilizar o pdf enviado pelo Walace)
- [ ] Melhor descrição das tarefas executadas e adaptações feitas no fluxo padrão da Jornada da Presidência, para utilização no evento da EMARF
- [ ] Descrição sucinta das tarefas executadas no apoio aos eventos Jornada na Presidência, que em tese é o conteúdo da seção "Utilização do Sistema"
- [ ] Incluir no Procedimento ciração ambiente local Desenvolvimento, descrição no terminal quando o bd e o app foram bem inicializados e estão disponíveis -- exemplo informação esperada no console quando o banco foi iniciado e estiver disponível
db-1  | 2026-05-12T21:04:21.017954Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.4.2'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL. 
Para edição do Readme.me utilizar instruções de https://docs.github.com/pt/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax 

- [Fórumjus](#fórumjus)
  - [Funcionalidades](#funcionalidades)
  - [Preparação do sistema para uso em Evento](#preparação-do-sistema-para-uso-em-evento)
  - [Procedimento para implantação](#procedimento-para-implantação)
  - [Procedimento criação ambiente local Desenvolvimento](#procedimento-criação-ambiente-local-desenvolvimento)
  - [Utilização do Sistema](#utilização-do-sistema)
    - [Perfis de Utilização](#perfis-de-utilização)
    - [Fases do Evento suportadas pelo Sistema](#fases-do-evento-suportadas-pelo-sistema)
    - [Possíveis Erros](#possíveis-erros)
    - [Pré-requisitos para uso do sistema em Eventos](#pré-requisitos-para-uso-do-sistema-em-eventos)
      - [No formato do Vitaliciamento da EMARF](#no-formato-do-vitaliciamento-da-emarf)
      - [No formato das Jornadas da Presidência](#no-formato-das-jornadas-da-presidência)
    - [Histórico de Eventos Suportados pelo Sistema](#histórico-de-eventos-suportados-pelo-sistema)
      - [Encontro Nacional de Juízas e Juízes Federais em Vitaliciamento. EMARF, 7 e 8 Maio/2026](#encontro-nacional-de-juízas-e-juízes-federais-em-vitaliciamento-emarf-7-e-8-maio2026)
      - [Jornadas da Presidência](#jornadas-da-presidência)
  - [Informações Importantes para Suporte e Desenvolvimento](#informações-importantes-para-suporte-e-desenvolvimento)
    - [urls relevantes da app](#urls-relevantes-da-app)
    - [Código fonte/artefatos importantes configurações BD](#código-fonteartefatos-importantes-configurações-bd)
    - [Ferramentas auxiliares para teste](#ferramentas-auxiliares-para-teste)
    - [Comandos de console mais utilizados](#comandos-de-console-mais-utilizados)
  - [Alterações no Código ou no Banco de Dados do Sistema](#alterações-no-código-ou-no-banco-de-dados-do-sistema)
    - [Para criar novo Migration (arquivo com script de BD para preparar BD para uso do app)](#para-criar-novo-migration-arquivo-com-script-de-bd-para-preparar-bd-para-uso-do-app)



## Funcionalidades
- Cadastro de participantes e seus enunciados, pelos próprios participante, protegido por reCaptchas
- Homologação dos enunciados para participar das Comissões
- Votação dos enunciados em Comissões
- Votação na Plenária Geral dos enunciados aprovados nas Comisões
- Geração de QR-Code para cada participante votar
- Emissão de Cadernos dos Enunciados
- Emissão de Atas de Ocorrências
- Notificação dos Participantes por E-mail
- Gerenciamento dos Dados pela Aplicação através de CRUDs das tabelas do BD (pGelos técnicos da TI)

## Preparação do sistema para uso em Evento
- Ver [Procedimento para implantação](#procedimento-para-implantação)
- Fazer as configurações referentes ao Evento
  - Logar como Programador, ver em [Perfis de Utilização](#perfis-de-utilização)
  - No item de menu Administração, acessar "/ambiente"
  - Definir
    - nome do evento
    - logo do evento   
  - 

## Procedimento para implantação
- Disponibilizar um banco de dados MySQL.

- Configurar as propriedades de ambiente:

  - Controle de acesso:
    - JWT_SECRET=***SUBSTITUIA_POR_UM_UUID_ALEATÓRIO***
    - JWT_EXPIRATION_TIME=24h

  - Google reCaptcha (estas são as chaves de teste, substituir por chaves válidas)
    - RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
    - RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
  
  - Acesso ao servidor de email:
    - SMTP_FROM=forumjus@empresa.com.br
    - SMTP_HOST=smtp.empresa.com.br
    - SMTP_PORT=25
    - SMTP_USER=
    - SMTP_PASSWORD=

  - Acesso ao servidor de banco de dados:
    - MYSQL_HOST=localhost
    - MYSQL_PORT=3306
    - MYSQL_USER=root
    - MYSQL_PASSWORD=
    - MYSQL_DATABASE=formjus

  - Informar a URL onde estará instalado o Fórumjus:
    - API_URL_BROWSER=http://localhost:8081/

  - Opcionalmente, restringir os emails que são aceitos como administrador:
    - ADMIN_EMAIL_REGEX=@empresa.com.br$ 

## Procedimento criação ambiente local Desenvolvimento
- Dependências
  - Docker (imagem roda Next.js e MySQl)
    - Next.js
    - MySQl
  - Visual Studio Code (VSC)
  - Git
- Instalar Dependências
- Clonar Projeto https://github.com/trf2-jus-br/forumjus
- Abrir projeto no VSC
- Copiar arquivo exemplo.env e renomear o arquivo copiado para .env
- Iniciar MySQL
  - No terminal do VS Code 
    - `docker compose up db`
- Criar os schemas utilizados
  - Em cliente MySQL, acessar com usuário 'root', utilizando a senha definida, nesta ordem de prioridade: [`MYSQL_ROOT_PASSWORD` em docker-compose.yml](/docker-compose.yml), [`MYSQL_PASSWORD` em .env](/.env)
  - Se ao tentar acessar o banco de dados, ocorrer o erro "Public Key Retrieval is not allowed"
    - Quick Fix in DBeaver: You can resolve this by adjusting the connection's driver properties:
    - Open Connection Settings: Right-click your connection in the Database Navigator and select Edit Connection.
    - Navigate to Driver Properties: Go to the Driver properties tab (next to the "Main" tab).
    - Update Property: Find the property named allowPublicKeyRetrieval and change its value to TRUE.
    -Note: If you don't see it, right-click the properties list and choose Add new property to manually add it.
  - Após conectar ao banco, executar: 
  ```
  CREATE SCHEMA trfForumJus;
  CREATE SCHEMA trfForumJus2;
  CREATE SCHEMA trfForumJus3;
  CREATE SCHEMA trfForumJus4;
  ```
  - No terminal do VS Code
    - Ctrl + C (1 ou mais vezes)
- Executar o sistema
  - No terminal do VS Code
    - `docker compose down`
    - `docker compose up`
  - Acessar http://localhost:8081/

## Utilização do Sistema

### Perfis de Utilização
- Presidente/Relator
  - Logado como Assessoria ou Programador, em Membros, obter url de presidente ou relator, clicando no ícone ao lado de presidente/relator e copiando url de acesso deste perfil
  - Acessar a url de acesso de presidente/relator
- Membro de Comissão (Proponente)
- Assessoria
  - http://localhost:8081/assessoria/login 
- Programador (além do menu da assessoria, possui link "Administração" com crud das tabelas do BD do sistema)
  - Pré-requisito: possuir autorização para perfil assessoria como programador 
    - ~~No SIGA-GI, permissão em "FORUMJUS: Sistema I Jornada de Direitos Humanos e Fundamentais" para a matrícula/lotação https://siga.jfrj.jus.br/siga/app/gi/acesso/listar~~ [^3]
    - Lotação do programador precisa constar na variável [`const LOTACOES_PERMITIDAS_SUPER_ADM` em pages/api/login.ts](pages/api/login.ts)
    - [`SIMULAR_ASSESSORIA=false` em .env](.env)
  - Acessar http://localhost:8081/assessoria/login
    
[^3]: alterado no commit https://github.com/trf2-jus-br/forumjus/commit/af4717d9b70f898563cb7e339f00eab72f11c7ca

### Fases do Evento suportadas pelo Sistema
- Página com Resumo das Fases http://localhost:8081/ajuda
- Inscrição/Envio de Enunciados: pessoa envia proposições/enunciados
  - Na página pública, http://localhost:8081/, clicar em "Inscrição"
- Homologação: comissão admite/rejeita proposições
  - Acessar como presidente ou relator, ver [Perfis de Utilização](#perfis-de-utilização)
- Votação na Comissão: Comissões votam proposições, que serão votadas na Plenária
- Votação na Plenária: Plenária vota proposições aprovadas nas Comissões
- Emissão de Cadernos
- Emissão de Atas de Ocorrências
- Notificação dos Participantes por E-mail

### Possíveis Erros
- ~~ao acessar http://localhost:8081/inscricoes, apresenta erro "You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '?' at line 5"~~ [^2]
[^2]: corrigido no commit https://github.com/trf2-jus-br/forumjus/commit/d15923370a75c3be32f1b42e21d7aeb9a86ed5f0 

### Pré-requisitos para uso do sistema em Eventos

#### No formato do Vitaliciamento da EMARF
- Para a equipe gestora do Evento
  - Fornecer a STI as informações e arquivos a serem lançados no sistema (nome,logo,datas,etc...)
    - detalhes do evento, no menu Administração, em "/ambiente"
    - datas dos eventos (inscrições, homologação, votaões), no menu Administração, em "/calendario"
  - Impressão de crachás com QR Code para acesso pelos proponentes/votantes
  - Pessoas da equipe gestora do Evento para dar suporte suporte aos usuários votantes, presidente e assessor
  - Receber instruções da STI para as pessoas que utilizarão o sistema
  - Solicitar à STI:
    - Notebook para uso do presidente/assessor, para as Votações
    - (opcional) Notebook para apresentar o "telão" das sessões de votação, para melhor acompanhamento do presidente/assessor
    - WiFi estável, todos os usuários do sistema precisam estar conectados no sistema
    - Técnico da TI para suporte a erros no sistema
    - Técnico de TI para suporte aos notebooks, wifi e demais recursos de TI do evento

#### No formato das Jornadas da Presidência


### Histórico de Eventos Suportados pelo Sistema

#### Encontro Nacional de Juízas e Juízes Federais em Vitaliciamento. EMARF, 7 e 8 Maio/2026
Contatos/Pessoas/Equipes Envolvidas: Juiz Vladmir Vitovsky/servidora Márcia Dias Bezerra

Pedido sistema para permitir em 3 oficinas não simultâneas, que os enunciados enviados previamente fossem votados (aprovado/rejeitado/abstenção) eletronicamente pelos participantes, com a apresentação do resultado da votação em telão, após o encerramento da votação de cada enunciado.
2 dias de evento, de 9h às 19h. Pedido suporte para que fossem lançados previamente os enunciados de cada uma das 3 oficinas. Os enunciados foram enviados por arquivos texto. 
Os votantes foram cadastrados diretamente no BD após ser enviada pela EMARf uma planilha Excel com nomes dos participantes, juízes em vitaliciamento. 
- Criado novo schema no BD
  - Foi criado novo schema, texto do chamado: "trfForumJus4 em produção e homologação, e os usuários de sistema, já criados anteriormente, deverão ter privilégios de consulta e alteração de dados nesse novo database" https://chamados.trf2.jus.br/front/ticket.form.php?id=2026020832
- Solicitada url para utilizado do sistema pelo evento
  - Criada url https://vitaliciamento.trf2.jus.br/ 
- Alterado código fonte para mapear url para o schema: ver [commit 9cf96f1ca5b624a6597422d3ef18e32eddbf4cde](https://github.com/trf2-jus-br/forumjus/commit/9cf96f1ca5b624a6597422d3ef18e32eddbf4cde)
- Executado, pelo Walace, tarefa no orc, para enviar novo código para homolgação
- Solicitada publicação, para SEGSAP, em produção do código alterado.
- Foi necessária algum ajuste no ambiente de produção, pela SEGSAP, para corrigir erro, salvo engano, no envio de imagens ou arquivos para o sistema.
- Lançamentos de informações diretamente no BD
  - Foi obtido acesso de escrita no BD de produção.
  - Lançadas informações básicas do evento, pelo sistema, em Administração /ambiente
  - Criadas 3 Comissões.
  - Foram criados scripts para inserir os enunciados em uma cada uma das 3 comissões (Nas Jornadas, salvo engano, os enunciados eram lançados pelos próprios proponnetes utilizando o sistema.)
  - Foram lançados direto no BD os participantes informados na planilha Excel, na Oficina 1
  - Walace homologou os enunciados **(confirmar se fez pelo sistema, item de menu Admissão do sistema, ou direto pelo BD)**
  - Walace simulou relator da comissão e aprovou os enunciados para a votação Geral [^5], para que durante o evento não fosse necessário registrar a presença dos votantes em cada uma das 3 oficinas (especialmente por que não foram impressos crachás com QR-Code dos juízes) **(confirmar se fez pelo sistema [^5], ou direto pelo BD)**
- No evento, como não houve tempo hábil para impressão de crachãs com nomes e QR-Code dos juizes:
  - na chegada dos juízes Djalma ou Walace, utilizava a página de Presença, simulando acesso de presidente/assessor, e escolhendo na combo de juízes cada juiz.
  - após registro de presença, a servidora da Emarf, ou Walace e Djalma, apresentavam aos juízes seu QR-Codes, procurando seus nomes na lista de membros da Oficina 1. Quando o juíz lia o QR-Code ele recebia e abria uma url com seu identificador no sistema, para poder votar. Informado aos juízes que deveriam guardar a url para votar em cada uma das oficinas.
- Durante cada oficina, os enunciados eram projetados no telão, apresentando a página votação, que já estava aberta no PC que projeta no telão.
- Quando o juiz dirigente da oficina, na página de controle da votação, iniciava a votação do enunciado, na página de votação dos participantes era apresentada, na parte inferior, botões para aprovar/negar/abestnção.  Em tempo real era apresentado no telão os votos efetuados.
- Quando o juiz dirigente da oficina, na página de controle da votação, terminava a votação do enunciado, era apresentado o resultado no telão, e gráfico de pizza com percentuais de aprovação,negação e abstenção.
- Walace enviou ao dr. Vladimir os cadernos de votação dos enunciados. Ele perguntou se poderia colocar o logo enviado anteriormente. Walace sugeriu ao Dr. Vladimir solicitar à gráfica fazer os ajustes necessários.
  
[^5]: descrever os itens alterados em Administração /ambiente, e como usou a página de votação da comissão, ou se lançou direto no BD. 


#### Jornadas da Presidência


## Informações Importantes para Suporte e Desenvolvimento

### urls relevantes da app
- http://localhost:8081/assessoria/login acesso assessoria e programador
- http://localhost:8081/presenca presente registra presença dos membros da comissão na reunião de votação
- http://localhost:8081/votacao  proponente com proposta admitida fará parte da comissão. em comissões é gerado arquivo zip com qr codes. o proponente acessará esta página para votar
- http://localhost:8081/resumo-jornada 
- http://localhost:8081/controle-votacao
- http://localhost:8081/register

### Código fonte/artefatos importantes configurações BD
- pages/api/login.ts - gerencia login
- .env
- docker-compose.yml - define containers utilizados
- migracoes/esquemas.ts - gerencia as urls e quais - esquemas de bd vinculados às urls **(contém lista de urls de produção e homologação)**

### Ferramentas auxiliares para teste
https://www.lipsum.com/ - gera texto, sugerido para a justificativa
https://www.4devs.com.br/gerador_de_cpf - gera cpf para informar na simulação de proponente

### Comandos de console mais utilizados
```
docker compose up                 executa o sisema (primeiro inicializa o bd e depois o app)
docker compose down               
docker compose up db              executa somente o bd
docker compose up db --build

git add .
git commit -m ""
git push
```

## Alterações no Código ou no Banco de Dados do Sistema

### Para criar novo Migration (arquivo com script de BD para preparar BD para uso do app)
- Cria novo arquivo de Migration
  - Se container já estiver rodando[^1], executar em outro terminal: `docker compose exec app npm run migration:create --migration`
  - Se container estiver parado: `docker compose run --rm app npm run migration:create --migration`
- Preencher arquivo criado com o script necessário
- Executar a nova migration criada (pois a configuração, em index.ts, migrationsRun:false, TypeORM não fará nada com as suas migrations automaticamente ao iniciar a aplicação)
  - Com o container rodando (para iniciar o container executar `docker compose up`[^1]), e executar em outro terminal `docker compose exec app npm run migrate-env`
  
 ver [Comandos de console mais utilizados](#comandos-de-console-mais-utilizados)

[^1]: PARA INICIAR/RODAR O CONTAINER `docker compose up`.







