interface Enunciado {
    committee_name: string,
    statement_text: string,
}

const EmailNotificarRejeicao = (enunciados : Enunciado[], nome: string) => `
<html>
    <head>
        <title>I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região</title>
    </head>
    <body>
        <div style="max-width:601px; margin: 0 auto">
        ${process.env.HOMOLOGACAO === "true" ? 
            `<h3 style="color: red; text-align: center;">
                E-mail de homologação de funcionalidades.<br/>
                Sem valor real para Jornada. <br/><br/>

                ${nome} <br/>
                ${enunciados.map(e => e.committee_name).join('<br/>')}
            </h3>` 
            : 
            ''}
            <img width="100%" src="cid:imagem" />
            <div style="margin-top: 10px">Prezado (a),</div><br/>
                
            <div style="text-indent: 30px;">Agradecemos o envio da(s) proposta(s) de enunciado(s) destinadas à discussão na <span style="font-weight: bold;">I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da Segunda Região</span>.</div>
            <div style="text-indent: 30px;">Informamos que sua(s) proposta(s) de enunciado(s) não foi(ram) admitida(s) pela(s) Comissão(ões) Temática(s) escolhida(s) e, portanto, não foi possível sua inscrição no evento.</div>

            <p style="text-indent: 30px; font-weight: bold;">Solicitamos que responda este e-mail indicando o recebimento do mesmo.</p>

            <div style="margin-top: 25px;">Atenciosamente,</div>
            <div style="margin-top: 25px; margin-bottom: 25px;">Equipe I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região.</div>
        </div>
    </body>
</html>
`;

export default EmailNotificarRejeicao;