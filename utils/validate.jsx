export default {
    electionName(s, context) {
        return this.name(s, context, 'eleição')
    },

    voterName(s, context) {
        return this.name(s, context, 'eleitor')
    },

    candidateName(s, context) {
        return this.name(s, context, 'candidato')
    },

    name(s, context, name) {
        if (!s) throw `Nome de ${name} não informado` + (context ? ' ' + context : '')
        s = s.trim()
        if (!s) throw `Nome de ${name} inválido` + (context ? ' ' + context : '')
        return s
    },

    emailRegex: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,

    voterEmail(s, context) {
        return this.email(s, context, 'eleitor')
    },

    administratorEmail(s, context) {
        const email = this.email(s, context, 'administrador')
        const adminEmailRegex = process.env.ADMIN_EMAIL_REGEX
        if (adminEmailRegex) {
            const regex = new RegExp(adminEmailRegex, '')
            if (!regex.test(email)) throw `E-mail de administrador não permitido`
        }
        return email
    },

    email(s, context, name) {
        if (!s) throw `E-mail de ${name} não informado` + (context ? ' ' + context : '')
        s = s.trim().toLowerCase()
        if (!this.validateEmail(s)) throw `E-mail de ${name} inválido` + (context ? ' ' + context : '')
        return s
    },

    validateEmail(email) {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    },

    validateCPF(s) {
        if (!s) return false;
        s = s.replace(/\D/g, "");
        let Soma = 0;
        let Resto;
        let i;
        if (s.length != 11 ||
            s == "00000000000" ||
            s == "11111111111" ||
            s == "22222222222" ||
            s == "33333333333" ||
            s == "44444444444" ||
            s == "55555555555" ||
            s == "66666666666" ||
            s == "77777777777" ||
            s == "88888888888" ||
            s == "99999999999")
            return false;

        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(s.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(s.substring(9, 10))) return false;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(s.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(s.substring(10, 11))) return false;
        return true;
    }
}