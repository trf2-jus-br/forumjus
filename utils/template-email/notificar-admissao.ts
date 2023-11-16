const EmailNotificarAdmissao = () => `
<html>
    <head>
        <title>I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região</title>
    </head>
    <body>
        <div style="max-width:601px; margin: 0 auto">
            ${process.env.HOMOLOGACAO === "true" ? '<h3 style="color: red; text-align: center;">E-mail de homologação de funcionalidades.<br/>Sem valor real para Jornada.</h3>' : '' }
            <img width="100%" src="cid:imagem" />
            <div style="margin-top: 10px">
                <div>Prezado (a),</div><br/>
                    
                <div style="text-indent: 30px;">Parabéns! Um de seus enunciados foi admitido.</div>
                <div style="text-indent: 30px;">Em caso de dúvida, entre em contato através do e-mail <a href="mailto:forumdhf@trf2.jus.br">forumdhf@trf2.jus.br.</a>.</div>
            </div>

            <div style="margin-top: 25px;">Atenciosamente,</div>
            <div style="margin-top: 25px;">Equipe I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região.</div>
        </div>
    </body>
</html>
`;

export default EmailNotificarAdmissao;