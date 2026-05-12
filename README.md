# Fórumjus

Fórumjus é um sistema desenvolvido para auxiliar em Fóruns e Jornadas no âmbito do Tribunal Regional Federal da 2&ordf; Região.


- [Fórumjus](#fórumjus)
  - [Funcionalidades](#funcionalidades)
  - [Procedimento para implantação](#procedimento-para-implantação)
  - [Procedimento criação ambiente local Desenvolvimento](#procedimento-criação-ambiente-local-desenvolvimento)
  - [Uso do Sistema](#uso-do-sistema)
    - [Perfis de Acesso Principais](#perfis-de-acesso-principais)
    - [Fases do Evento suportadas pelo Sistema](#fases-do-evento-suportadas-pelo-sistema)
  - [Informações Importantes para Suporte e Desenvolvimento](#informações-importantes-para-suporte-e-desenvolvimento)
    - [configurar sistema para o evento](#configurar-sistema-para-o-evento)
    - [urls relevantes da app](#urls-relevantes-da-app)
    - [Código fonte/artefatos importantes configurações BD](#código-fonteartefatos-importantes-configurações-bd)
    - [Ferramentas auxiliares para teste](#ferramentas-auxiliares-para-teste)
    - [Para criar novo Migration (arquivo com script de BD para preparar BD para uso do app)](#para-criar-novo-migration-arquivo-com-script-de-bd-para-preparar-bd-para-uso-do-app)
    - [Comandos mais utilizados](#comandos-mais-utilizados)
  - [Erros previstos](#erros-previstos)
  - [Eventos Suportados pelo Sistema](#eventos-suportados-pelo-sistema)
    - [Encontro Nacional de Juízas e Juízes Federais em Vitaliciamento. EMARF, 7 e 8 Maio/2026](#encontro-nacional-de-juízas-e-juízes-federais-em-vitaliciamento-emarf-7-e-8-maio2026)
    - [Jornadas da Presidência](#jornadas-da-presidência)
  - [Pré-requisitos para uso do sistema em Eventos](#pré-requisitos-para-uso-do-sistema-em-eventos)
    - [No formato do Vitaliciamento da EMARF](#no-formato-do-vitaliciamento-da-emarf)
    - [No formato das Jornadas da Presidência](#no-formato-das-jornadas-da-presidência)


## Funcionalidades
- Cadastro de participantes e seus enunciados, protegido por reCaptcha.

## Procedimento para implantação

- Disponibilizar um banco de dados MySQL.
- Criar os schemas: ver arquivo migracoes/esquemas.ts

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
- Iniciar MySQL
  - No terminal do VS Code 
    - `docker compose up db`
- Criar os schemas utilizados
  - Em cliente MySQL, acessar com usuário 'root', utilizando a senha definida, nesta ordem de prioridade: docker-compose.yml (MYSQL_ROOT_PASSWORD), .env (MYSQL_PASSWORD)
  - Executar: 
  ```
  CREATE SCHEMA trfForumJus;
  CREATE SCHEMA trfForumJus2;
  CREATE SCHEMA trfForumJus3;
  CREATE SCHEMA trfForumJus4;
  ```
  - No terminal do VS Code
    - Ctrl + C (2 ou mais vezes)
- Executar o sistema
  - No terminal do VS Code
    - `docker compose down`
    - `docker compose up`
  - Acessar http://localhost:8081/
- Acessar sistema com permissão Assessoria (acesso administrativo)
  - autorização para módulo adm (assessoria e programador)
    - ~~No SIGA-GI, permissão em "FORUMJUS: Sistema I Jornada de Direitos Humanos e Fundamentais" para a matrícula/lotação https://siga.jfrj.jus.br/siga/app/gi/acesso/listar~~ [^3]
    - No arquivo .env, SIMULAR_ASSESSORIA=false
  - Acessar http://localhost:8081/assessoria/login
    
[^3]: alterado no commit https://github.com/trf2-jus-br/forumjus/commit/af4717d9b70f898563cb7e339f00eab72f11c7ca

## Uso do Sistema

### Perfis de Acesso Principais
- Presidente
- Membro de Comissão (Proponente)
- ADM http://localhost:8081/assessoria/login   ???Confirmar???
- Programador http://localhost:8081/assessoria/login

### Fases do Evento suportadas pelo Sistema
- Página com Resumo das Fases http://localhost:8081/ajuda
- Inscrição: pessoa envia proposições
  - Na página pública, clicar em "Inscrição"
- Homologação: comissão admite/rejeita proposições
  - Acessar como presidente ou relator
  - Logado como Assessoria, em Membros, obter url de presidente ou relator, clicando no ícone ao lado de presidente/relator e copiando url de acesso deste perfil
  - Acessar a url de acesso de presidente/relator
- No menu, escolher opção "Membros".  Abrirá página 
- Votação por Comissão: comissão vota proposições
  -  
- Emissão de Cadernos 
  - 

## Informações Importantes para Suporte e Desenvolvimento

### configurar sistema para o evento
- 

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

### Para criar novo Migration (arquivo com script de BD para preparar BD para uso do app)
- Cria novo arquivo de Migration
  - SE CONTAINR JÁ ESTIVER RODANDO[^1], EXECUTAR EM OUTRO TERMINAL: docker compose exec app npm run migration:create --migration 
  - SE CONTAINER ESTIVER PARADO: docker compose run --rm app npm run migration:create --migration
- Preencher arquivo criado com o script necessário
- Executar a nova migration criada (pois a configuração, em index.ts, migrationsRun:false, TypeORM não fará nada com as suas migrations automaticamente ao iniciar a aplicação)
  - SE CONTAINR JÁ ESTIVER RODANDO[^1], EXECUTAR EM OUTRO TERMINAL: docker compose exec app npm run migrate-env  
  - SE CONTAINER ESTIVER PARADO: docker compose run --rm app npm run migrate-env 

[^1]: PARA INICIAR/RODAR O CONTAINER docker compose up.

### Comandos mais utilizados
```
docker compose up
docker compose up db
docker compose up db --build
docker compose down

git add .
git commit -m ""
git push

docker status
docker ps
docker info

wsl --list
```



## Erros previstos
- ~~ao acessar http://localhost:8081/inscricoes, apresenta erro "You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '?' at line 5"~~ [^2]
[^2]: corrigido no commit https://github.com/trf2-jus-br/forumjus/commit/d15923370a75c3be32f1b42e21d7aeb9a86ed5f0 

## Eventos Suportados pelo Sistema

### Encontro Nacional de Juízas e Juízes Federais em Vitaliciamento. EMARF, 7 e 8 Maio/2026
Contatos/Pessoas/Equipes Envolvidas: Juiz Vladmir Vitovsky/ servidora Márcia Dias Bezerra

Pedido. Sistema para permitir em 3 oficinas, que os enunciados enviados previamente, fossem votados (aprovado/rejeitado/    ) eletronicamente pelos participantes, com o resultado aprovado após o encerramento da votação.

2 dias de evento, de 9h às 19h. Pedido suporte para que fossem lançados previamente os enunciados de cada uma das 3 oficinas. Os enunciados foram enviados por arquivos texto. 
Os votantes foram cadastrados diretamente no BD após ser enviada pela EMARf uma planilha Excel com nomes dos participantes, juízes em vitaliciamento. 
Relação dos 

Durante cada oficina os enunciados serão votados, onde cada 

- Criado novo schema no BD
  - Foi criado novo schema:  trfForumJus4 em produção e homologação, e os usuários de sistema, já criados anteriormente, deverão ter privilégios de consulta e alteração de dados nesse novo database. exemplo: https://chamados.trf2.jus.br/front/ticket.form.php?id=2026020832

- Solicitada url para utilizado do sistema pelo evento
  - Criada url https://vitaliciamento.trf2.jus.br/ 

- Alterado código fonte para mapear url para o schema: ver commit 9cf96f1ca5b624a6597422d3ef18e32eddbf4cde

- Lançamentos de informações diretamente no BD
  - Foi obtido acesso de escrita no BD de produção.
  - Foram criados scripts para inserir os enunciados (Nas Jornadas, salvo engano, os enunciados eram lançados pelos próprios proponnetes utilizando o sistema.)

### Jornadas da Presidência

## Pré-requisitos para uso do sistema em Eventos

### No formato do Vitaliciamento da EMARF
- Notebook para uso do presidente/assessor, das Fases de Homologação e Votação
- (opcional) Notebook para apresentar o "telão" das sessões de votação, para melhor acompanhamento do presidente/assessor
- WiFi estável, todos os usuários do sistema precisam estar conectados no sistema
- Impressão de crachás com QR Code para acesso pelos proponentes/votantes
- Treinamento de pessoas da equipe gestora do evento para dar suporte aos usuários votantes, presidente e assessor
- Pessoas da equipe gestora do Evento para dar suporte suporte aos usuários votantes, presidente e assessor
- Técnico da TI para suporte a erros no sistema
- Técnico de TI para suporte aos notebooks, wifi e demais recursos de TI do evento

### No formato das Jornadas da Presidência
