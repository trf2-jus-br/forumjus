import { apiHandler } from "../../utils/apis"

const handler = function (req, res) {
    res.status(200).json(result);
}

export default apiHandler({
    'GET': handler
});