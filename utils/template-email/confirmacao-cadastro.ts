function enunciados(data, ambiente: Ambiente, ocupacoes: Ocupacao[], comites: Comite[]) {
    return data.statement.reduce((acc, s, i) => {
        return acc + 
        `<div style="margin-top: 25px;">
            Enunciado ${i + 1}
            <ul>
                <li><strong>Comissão:</strong> ${comites.find(e => e.committee_id == s.committeeId).committee_name}</li>
                <li><strong>Enunciado:</strong> "${s.text}"</li>
                <li><strong>Justificativa:</strong> "${s.justification}"</li>
            </ul>                
        </div>`
    }, "");
}

const EmailConfirmacaoCadastro = (data, ambiente: Ambiente, ocupacoes: Ocupacao[], comites: Comite[]) => `
<html>
    <head>
        <title>${ambiente.NOME}</title>
    </head>
    <body>
        <div style="max-width:601px; margin: 0 auto">
            ${process.env.HOMOLOGACAO === "true" ? '<h3 style="color: red; text-align: center;">E-mail de homologação de funcionalidades.<br/>Sem valor real para Jornada.</h3>' : '' }
            <img width="100%" src="cid:imagem" />
            <div style="margin-top: 10px">
                <div>Prezado (a),</div><br/>
                    
                <div style="text-indent: 30px;">Confirmamos o recebimento da(s) sua(s) proposta(s) de enunciado(s).</div>
                <div style="text-indent: 30px;">Caso sua proposta seja selecionada, sua inscrição na Jornada será automaticamente aceita, assim como sua participação na Comissão Temática objeto daquela.</div>
                <div style="text-indent: 30px;">Na hipótese de mais de uma proposta de enunciado de sua autoria ter sido admitida, mas essas pertencerem a Comissões Temáticas diferentes, caberá a Vossa Senhoria optar por apenas uma Comissão, conforme estabelecido no regimento da Jornada.</div>
                <div style="text-indent: 30px;">Nesse último caso, a organização da Jornada entrará em contato, para que opte pela Comissão na qual deseja se inscrever.</div>
                <div style="text-indent: 30px;">A admissão ou não da(s) proposta(s) de enunciado(s) será comunicada através do e-mail cadastrado.</div>
                <div style="text-indent: 30px;">Em caso de dúvida, entre em contato através de <a href="mailto:${ambiente.EMAIL_ORGANIZACAO}">${ambiente.EMAIL_ORGANIZACAO}</a>.</div>
            </div>

            <div style="margin-top: 25px;">
                Dados recebidos:
                <ul>
                    <li><strong>Nome Completo</strong>: ${data.attendeeName}</li>
                    <li><strong>Nome Social:</strong> ${data.attendeeChosenName ? data.attendeeChosenName : ''}</li>
                    <li><strong>E-Mail:</strong> ${data.attendeeEmail}</li>
                    <li><strong>Telefone:</strong> ${data.attendeePhone}</li>
                    <li><strong>Profissão:</strong> ${ocupacoes.find(e => e.occupation_id == data.attendeeOccupationId).occupation_name}</li>
                    <li><strong>Vinculado a qual Órgão:</strong> ${data.attendeeAffiliation}</li>
                    <li><strong>Pessoa com Deficiência:</strong> ${data.attendeeDisabilityYN === true || data.attendeeDisabilityYN === 'true' ? 'Sim' : 'Não'}${data.attendeeDisabilityYN === true || data.attendeeDisabilityYN === 'true' ? '\n- Descrever a Necessidade de Atendimento Especial: ' + data.attendeeDisability : ''}</li>
                </ul>
            </div>

            ${enunciados(data, ambiente, ocupacoes, comites)}

            <div style="margin-top: 25px;">Atenciosamente,</div>
            <div style="margin-top: 25px;">Equipe ${ambiente.NOME}.</div>
        </div>
    </body>
</html>
`;

export default EmailConfirmacaoCadastro;