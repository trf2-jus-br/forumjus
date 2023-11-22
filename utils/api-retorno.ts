export function retornoAPI(error){
    const httpBody = error?.response?.data?.error;

    let errorMsg = httpBody?.err?.message || httpBody?.err || httpBody?.message || httpBody?.response;
    
    if(typeof errorMsg !== "string")
        errorMsg = "Indisponibilidade de sistema.";

    return errorMsg;
}