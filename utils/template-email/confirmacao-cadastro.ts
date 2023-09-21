function enunciados(data, forumConstants) {
    return data.statement.reduce((acc, s, i) => {
        return acc + 
        `<div style="margin-top: 25px;">
            Enunciado ${i + 1}
            <ul>
                <li><strong>Comissão:</strong> ${forumConstants.committee[s.committeeId].name}</li>
                <li><strong>Enunciado:</strong> "${s.text}"</li>
                <li><strong>Justificativa:</strong> "${s.justification}"</li>
            </ul>                
        </div>`
    }, "");
}

const EmailConfirmacaoCadastro = (data, forumConstants) => `
<html>
    <head>
        <title>Display Image</title>
    </head>
    <body>
        <div style="max-width:601px; margin: 0 auto">
            <img width="100%" src="cid:imagem" />
            <div style="margin-top: 10px">
                <div>Prezado (a),</div><br/>
                    
                <div style="text-indent: 30px;">Confirmamos o recebimento da(s) sua(s) proposta(s) de enunciado(s). Essa(s) será (ão) analisada(s) pelo (a) Relator (a) da Comissão Temática pertinente.</div>
                <div style="text-indent: 30px;">Caso sua proposta seja selecionada, sua inscrição na Jornada será automaticamente aceita, assim como sua participação na Comissão Temática objeto daquela.</div>
                <div style="text-indent: 30px;">Na hipótese de mais de uma proposta de enunciado de sua autoria ter sido admitida, mas essas pertencerem a Comissões Temáticas diferentes, caberá a Vossa Senhoria optar por apenas uma Comissão, conforme estabelecido no regulamento da Jornada.</div>
                <div style="text-indent: 30px;">Nesse último caso, a organização da Jornada entrará em contato, para que Vossa Senhoria faça a opção pela Comissão na qual deseja se inscrever.</div>
                <div style="text-indent: 30px;">A admissão ou não da(s) proposta(s) de enunciado(s) será comunicada através do e-mail cadastrado.</div>
                <div style="text-indent: 30px;">Em caso de dúvida, entre em contato através do e-mail <a href="mailto:forumdhf@trf2.jus.br">forumdhf@trf2.jus.br.</a>.</div>
            </div>

            <div style="margin-top: 25px;">
                    Dados recebidos:
                    <ul>
                        <li><strong>Nome Completo</strong>: ${data.attendeeName}</li>
                        <li><strong>Nome Social:</strong> ${data.attendeeChosenName ? data.attendeeChosenName : ''}</li>
                        <li><strong>E-Mail:</strong> ${data.attendeeEmail}</li>
                        <li><strong>Telefone:</strong> ${data.attendeePhone}</li>
                        <li><strong>Profissão:</strong> ${forumConstants.occupation[data.attendeeOccupationId].name}</li>
                        <li><strong>Vinculado a qual Órgão:</strong> ${data.attendeeAffiliation}</li>
                        <li><strong>Pessoa com Deficiência:</strong> ${data.attendeeDisabilityYN === true || data.attendeeDisabilityYN === 'true' ? 'Sim' : 'Não'}${data.attendeeDisabilityYN === true || data.attendeeDisabilityYN === 'true' ? '\n- Descrever a Necessidade de Atendimento Especial: ' + data.attendeeDisability : ''}</li>
                    </ul>
                </div>

            ${enunciados(data, forumConstants)}
        <div>
    </body>
</html>
`;

console.log(EmailConfirmacaoCadastro)


export default EmailConfirmacaoCadastro;