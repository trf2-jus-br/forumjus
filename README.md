# Fórumjus

Fórumjus é um sistema desenvolvido para auxiliar em Fóruns e Jornadas no âmbito do Tribunal Regional Federal da 2&ordf; Região.

Funcionalidades:
- Cadastro de participantes e seus enunciados, protegido por reCaptcha.

Procedimento para implantação:

- Disponibilizar um banco de dados MySQL e executar o script migration-001.sql.

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
