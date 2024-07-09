interface Enunciado {
    committee_name: string,
    statement_text: string,
}

const EmailNotificarDivergencia = (ambiente:Ambiente, enunciados : Enunciado[], nome: string) => `
<html>
    <head>
        <title>${ambiente.NOME}</title>
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

            <p>Prezado(a),</p>
                
            <p style="text-indent: 30px;">Bem-vindo(a) ao evento <span style="font-weight: bold;">${ambiente.NOME}</span>.</p>
            <p style="text-indent: 30px;">Informamos que somente sua(s) proposta(s) de enunciado, abaixo transcrita(s), foi(ram) admitida(s). Contudo para que sua inscrição seja efetivada, é necessário indicar a qual Comissão Temática deseja integrar impreterivelmente até o dia 04/03/2024 através do e-mail <a href="mailto:${ambiente.EMAIL_ORGANIZACAO}">${ambiente.EMAIL_ORGANIZACAO}</a>.</p>

            ${enunciados.map(e => (
                `<div style="font-weight: bold;">(   ) ${e.committee_name}</div>
                <p style="padding-top: 10px; text-align: justify; font-style: italic;">
                    ´${e.statement_text}\`
                </p>`
            )).join('\n')}
            
            <p style="text-indent: 30px;">Estamos muito felizes em contar com sua participação nesta ${ambiente.NOME_REDUZIDO}, que certamente produzirá excelentes frutos, tendo em vista os relevantes temas a serem debatidos por profissionais qualificados.</p>
            <p style="text-indent: 30px;">O evento acontecerá no auditório do Tribunal Regional da 2ª Região, localizado à Rua Acre, 80, 3º andar, Centro, Rio de Janeiro.</p>
            <p>Segue abaixo o cronograma:</p>
            
            <!-- 1º dia -->
            <table style="border: solid 1px black; width: 90%; border-collapse: collapse; margin: 20px auto;">
                <thead>
                    <tr>
                        <th colspan="2">10 de abril de 2024, quarta-feira</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: solid 1px black; padding: 3px; width: 25%;">14h</td>
                        <td style="border: solid 1px black; padding: 3px;">Credenciamento</td>
                    </tr>
                    <tr>
                        <td style="border: solid 1px black; padding: 3px; width: 25%;">15h</td>
                        <td style="border: solid 1px black; padding: 3px;">Abertura</td>
                    </tr>
                    <tr>
                        <td style="border: solid 1px black; padding: 3px; width: 25%;">15h30min</td>
                        <td style="border: solid 1px black; padding: 3px;">Conferência de Abertura</td>
                    </tr>
                    <tr>
                        <td style="border: solid 1px black; padding: 3px; width: 25%;">17h</td>
                        <td style="border: solid 1px black; padding: 3px;">Encerramento das atividades do dia</td>
                    </tr>
                </tbody>
            </table>

            <!-- 2º dia -->
            <table style="border: solid 1px black; width: 90%; border-collapse: collapse; margin: 20px auto;">
                <thead>
                    <tr>
                        <th colspan="2">11 de abril de 2024, quinta-feira</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: solid 1px black; padding: 3px; width: 25%;">14h</td>
                        <td style="border: solid 1px black; padding: 3px;">Abertura dos trabalhos nas Comissões</td>
                    </tr>
                    <tr>
                        <td style="border: solid 1px black; padding: 3px; width: 25%;">19h</td>
                        <td style="border: solid 1px black; padding: 3px;">Encerramento das atividades do dia</td>
                    </tr>
                </tbody>
            </table>

            <!-- 3º dia -->
            <table style="border: solid 1px black; width: 90%; border-collapse: collapse; margin: 20px auto;">
                <thead>
                    <tr>
                        <th colspan="2">12 de abril de 2024, sexta-feira</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: solid 1px black; padding: 3px; width: 25%;">9h</td>
                        <td style="border: solid 1px black; padding: 3px;">Reunião Plenária</td>
                    </tr>
                    <tr>
                        <td style="border: solid 1px black; padding: 3px; width: 25%;">13h</td>
                        <td style="border: solid 1px black; padding: 3px;">Encerramento da Jornada</td>
                    </tr>
                </tbody>
            </table>

            <p style="text-indent: 30px;">Enviamos anexo o Regulamento da Jornada, aprovado pela Portaria nº ${ambiente.REGULAMENTO_PORTARIA}, que, nos Capítulos V e VI, esclarece os procedimentos para discussão e votação das proposições de enunciados nas Comissões Temáticas e na Sessão Plenária.</p>
            <p style="text-indent: 30px;">Em caso de dúvida, entre em contato através do e-mail <a href="mailto:${ambiente.EMAIL_ORGANIZACAO}">${ambiente.EMAIL_ORGANIZACAO}</a> ou do telefone (21) 2282-8374.</p>

            <p style="text-indent: 30px; font-weight: bold;">Solicitamos que responda este e-mail indicando o recebimento do mesmo e a qual Comissão Temática deseja integrar impreterivelmente até o dia 04/03/2024.</p>

            <div style="margin-top: 25px;">Atenciosamente,</div>
            <div style="margin-top: 25px; margin-bottom: 25px;">Equipe ${ambiente.NOME}.</div>
        </div>
    </body>
</html>
`;

export default EmailNotificarDivergencia;