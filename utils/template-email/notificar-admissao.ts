interface Enunciado {
    committee_name: string,
    statement_text: string,
}

export function cronograma(ambiente: Ambiente) {
    const dados = JSON.parse(ambiente.CRONOGRAMA_JSON);
    
    const linha = (acao : string[]) => `<tr>
        <td style="border: solid 1px black; padding: 3px; width: 25%;">${acao[0]}</td>
        <td style="border: solid 1px black; padding: 3px;">${acao[1]}</td>
    </tr>`

    const tabelas = Object.keys(dados).map(evento => (
        `<table style="border: solid 1px black; width: 90%; border-collapse: collapse; margin: 20px auto;">
            <thead>
                <tr>
                    <th colspan="2">${evento}</th>
                </tr>
            </thead>
            <tbody>
                ${ dados[evento].map(acao => linha(acao)).join('\n') }
            </tbody>
        </table>`
    ))

    return  tabelas.join('\n')
}

const EmailNotificarAdmissao = (ambiente: Ambiente, enunciados : Enunciado[], nome: string) => `
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
            <p style="text-indent: 30px;">Informamos que somente sua(s) proposta(s) de enunciado, abaixo transcrita(s), foi(ram) admitida(s). Deste modo, sua inscrição foi efetivada junto à Comissão Temática <span style="font-weight: bold;">${enunciados[0].committee_name}</span>.</p>

            ${enunciados.map(e => (
                `<p style="padding: 10px 0px; text-align: justify; font-style: italic;">
                    ´${e.statement_text}\`
                </p>`
            )).join('\n')}
            
            <p style="text-indent: 30px;">Estamos muito felizes em contar com sua participação nesta ${ambiente.NOME_REDUZIDO}, que certamente produzirá excelentes frutos, tendo em vista os relevantes temas a serem debatidos por profissionais qualificados.</p>
            <p style="text-indent: 30px;">O evento acontecerá ${ambiente.LOCAL_EVENTO}</p>
            <p>Segue abaixo o cronograma:</p>
            ${ cronograma(ambiente)}
            <p style="text-indent: 30px;">Enviamos anexo o Regulamento da Jornada, aprovado pela Portaria nº ${ambiente.REGULAMENTO_PORTARIA}, que, nos ${ambiente.REGULAMENTO_CAPITULOS_DESTACADOS}, esclarece os procedimentos para discussão e votação das proposições de enunciados nas Comissões Temáticas e na Sessão Plenária.</p>
            <p style="text-indent: 30px;">Em caso de dúvida, entre em contato através do e-mail <a href="mailto:${ambiente.EMAIL_ORGANIZACAO}">${ambiente.EMAIL_ORGANIZACAO}</a> ou do telefone ${ambiente.TELEFONE_ORGANIZACAO}.</p>

            <p style="text-indent: 30px; font-weight: bold;">Solicitamos que responda este e-mail indicando o recebimento do mesmo.</p>

            <div style="margin-top: 25px;">Atenciosamente,</div>
            <div style="margin-top: 25px; margin-bottom: 25px;">Equipe ${ambiente.NOME}.</div>
        </div>
    </body>
</html>
`;

export default EmailNotificarAdmissao;