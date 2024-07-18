import os from 'os';

import { apiHandler } from "../../utils/apis";

async function getUser({res} : API){
    const user = os.userInfo();
    
    res.send(
        JSON.stringify(user, null, 3)
    )
}

export default apiHandler({
    GET: getUser
})