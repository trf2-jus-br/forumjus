"use server"

import ForumDAO from "../../db/forum";
import { apiHandler } from "../../utils/apis";

async function ultimoForum({res, db}: API){
    const forum = await ForumDAO.ultimo(db);   
    res.status(200).send(forum);
}

export default apiHandler({
    "GET": ultimoForum
})