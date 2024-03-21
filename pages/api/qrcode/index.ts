import PresencaDAO from "../../../db/presenca";
import { apiHandler } from "../../../utils/apis";

async function criar({req, res, db, usuario}: API) {
    const { token } = req.body;
    if (token) {
        try {
            const resultado = await PresencaDAO.marcarEntradaComToken(db, usuario, token);
            res.send(resultado);
        } catch (error) {
            res.status(500).send({erro: "QR code invalido"});
        }
    } else {
        res.status(400).send({ error: "Token é necessário para marcar a presença." });
    }
}

export default apiHandler({
    POST: criar,
})
