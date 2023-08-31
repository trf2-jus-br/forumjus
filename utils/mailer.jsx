const nodemailer = require('nodemailer')

const options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secureConnection: false, // TLS requires secureConnection to be false
    secure: false,
    ignoreTLS: true,
    tls: {
        rejectUnauthorized: false
    }
}

export default {
    mailer: nodemailer,

    transporter: nodemailer.createTransport(options),

    from: process.env.SMTP_FROM,

    send(message) {
        this.transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                // console.log(info);
            }
        })
    },

    footer(electionId) {
        return `

Obrigado por utilizar o Votejus.

---
VOTEJUS-${electionId}`
    },

    sendCreated(email, electionId, electionName, administratorLink) {
        this.send({
            from: this.from,
            to: email,
            subject: `${electionName}: Criada`,
            text: `A votação "${electionName}" foi criada com sucesso.
    
Utilize o link abaixo para iniciar a votação e acompanhar os resultados.

${administratorLink}

Atenção:

- Os eleitores só reberão um link por e-mail para votar quando a votação for iniciada.

- Não compartilhe este link pois só o administrados da votação deve ter acesso ao link.

- Não apague esse email pois sem o link acima não será possível acessar o painel de votação.` + this.footer(electionId)
        })
    },

    sendVoteRequest(email, electionId, electionName, voterName, voterLink) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Voto Solicitado`,
            text: `Prezado(a) ${voterName},

A votação "${electionName}" foi iniciada.

Utilize o link abaixo para votar sigilosamente:

${voterLink}

Atenção: 

- Não compartilhe este link para que ninguém possa votar em seu nome.

- Não apague esse email pois sem o link acima não será possível votar.

- Depois de votar, não será possível trocar o voto.` + this.footer(electionId)
        })
    },

    sendVoteAccepted(email, electionId, electionName, voterName, voterIp) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Voto Registrado`,
            text: `Prezado(a) ${voterName},

Seu voto sigiloso foi registrado para a eleição "${electionName}".` + this.footer(electionId)
        })
    },

    sendElectionEnded(email, electionId, electionName, voterName) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Eleição Finalizada`,
            text: `Prezado(a) ${voterName},

A votação "${electionName}" foi encerrada.` + this.footer(electionId)
        })
    },

    forumFooter(forumName) {
        return `

Atenciosamente,

Equipe ${forumName}.`
    },

    sendRegistered(email, forumConstants, data) {
        let text = `Prezado(a),

Confirmamos o recebimento da(s) sua(s) proposta(s) de enunciado(s). Essa(s) será(ão) analisada(s) pelo(a) Relator(a) da Comissão Temática pertinente.

Caso sua proposta seja admitida, sua inscrição na Jornada será automaticamente deferida, assim como sua participação na Comissão Temática objeto daquela.

Na hipótese de mais de uma proposta de enunciado de sua autoria ter sido admitida, mas essas pertencerem a Comissões Temáticas diferentes, caberá a Vossa Senhoria optar por apenas uma Comissão, conforme estabelecido no regulamento da Jornada.

Nesse último caso, a organização da Jornada entrará em contato, para que Vossa Senhoria faça a opção pela Comissão na qual deseja se inscrever.

No caso da sua proposta de enunciado não ser admitida, sua inscrição será automaticamente indeferida.

O deferimento ou indeferimento da(s) proposta(s) de enunciado(s) será comunicado através do e-mail cadastrado.

Em caso de dúvida, entre em contato através do e-mail forumdhf@trf2.jus.br.

Dados recebidos:
- Nome Completo: ${data.attendeeName}
- Nome Social: ${data.attendeeChosenName ? data.attendeeChosenName : ''}
- E-Mail: ${data.attendeeEmail}
- Telefone: ${data.attendeePhone}
- CPF: ${data.attendeeDocument}
- Profissão: ${forumConstants.occupation[data.attendeeOccupationId].name}
- Vinculado a qual Órgão: ${data.attendeeAffiliation}
- Pessoa com Deficiência: ${data.attendeeDisabilityYN === true || data.attendeeDisabilityYN === 'true' ? 'Sim' : 'Não'}${data.attendeeDisabilityYN === true || data.attendeeDisabilityYN === 'true' ? '\n- Descrever a Necessidade de Atendimento Especial: ' + data.attendeeDisability : ''}`

        let i = 0
        data.statement.forEach(s => {
            i++
            text += `

Enunciado ${i}
- Comissão: ${forumConstants.committee[s.committeeId].name}
- Enunciado: "${s.text}"
- Justificativa: "${s.justification}"`
        })

        text += this.forumFooter(forumConstants.forumName)

        this.send({
            from: this.from,
            to: email.trim(),
            bcc: 'forumdhf@trf2.jus.br',
            subject: `${forumConstants.forumName}`,
            text: text
        })
    },

}