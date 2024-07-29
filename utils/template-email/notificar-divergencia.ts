import { cronograma } from "./notificar-admissao";

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
            <p style="text-indent: 30px;">Informamos que somente sua(s) proposta(s) de enunciado, abaixo transcrita(s), foi(ram) admitida(s). Contudo para que sua inscrição seja efetivada, é necessário indicar a qual Comissão Temática deseja integrar impreterivelmente até o dia ${ambiente.DATA_LIMITE_ESCOLHA_COMISSAO} através do e-mail <a href="mailto:${ambiente.EMAIL_ORGANIZACAO}">${ambiente.EMAIL_ORGANIZACAO}</a>.</p>

            ${enunciados.map(e => (
                `<div style="font-weight: bold;">(   ) ${e.committee_name}</div>
                <p style="padding-top: 10px; text-align: justify; font-style: italic;">
                    ´${e.statement_text}\`
                </p>`
            )).join('\n')}
            
            <p style="text-indent: 30px;">Estamos muito felizes em contar com sua participação nesta ${ambiente.NOME_REDUZIDO}, que certamente produzirá excelentes frutos, tendo em vista os relevantes temas a serem debatidos por profissionais qualificados.</p>
            <p style="text-indent: 30px;">O evento acontecerá ${ambiente.LOCAL_EVENTO}</p>
            <p>Segue abaixo o cronograma:</p>
            
            ${cronograma(ambiente)}

            <p style="text-indent: 30px;">Enviamos anexo o Regimento da Jornada, aprovado pela Portaria nº ${ambiente.REGULAMENTO_PORTARIA}, que, nos ${ambiente.REGULAMENTO_CAPITULOS_DESTACADOS}, esclarece os procedimentos para discussão e votação das proposições de enunciados nas Comissões Temáticas e na Sessão Plenária.</p>
            <p style="text-indent: 30px;">Em caso de dúvida, entre em contato através de <a href="mailto:${ambiente.EMAIL_ORGANIZACAO}">${ambiente.EMAIL_ORGANIZACAO}</a> ou do telefone ${ambiente.TELEFONE_ORGANIZACAO}.</p>

            <p style="text-indent: 30px; font-weight: bold;">Solicitamos que responda este e-mail indicando o recebimento do mesmo e a qual Comissão Temática deseja integrar impreterivelmente até o dia ${ambiente.DATA_LIMITE_ESCOLHA_COMISSAO}.</p>

            <div style="margin-top: 25px;">Atenciosamente,</div>
            <div style="margin-top: 25px; margin-bottom: 25px;">Equipe ${ambiente.NOME}.</div>
        </div>
    </body>
</html>
`;

export default EmailNotificarDivergencia;