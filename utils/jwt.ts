import * as jose from 'jose'

export default {
    secret: (ambiente: Ambiente) => new TextEncoder().encode(process.env.JWT_SECRET + ambiente.JWT_SALT),

    alg: 'HS256',

    async buildJwt(payload, ambiente: Ambiente) {
        return await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: this.alg })
            .setIssuedAt()
            .setIssuer(process.env.API_URL_BROWSER)
            .setExpirationTime(process.env.JWT_EXPIRATION_TIME)
            .sign(this.secret(ambiente))
    },

    async parseJwt(jwt, ambiente: Ambiente) {
        const { payload, protectedHeader } = await jose.jwtVerify(jwt, this.secret(ambiente), {
            issuer: process.env.API_URL_BROWSER,
        })

        return payload
    }
}