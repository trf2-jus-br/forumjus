import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function RelatorioQuantidadeEnunciados(comites: DetalheComite[]){
    const numeros = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X' ]

    try{
        console.log("RelatorioQuantidadeEnunciados")
        const pdf = pdfMake.createPdf({
            content: [
                {
                    text: "QUANTIDADE DE PROPOSTAS DE ENUNCIADOS DA I JORNADA DE DIREITOS HUMANOS E FUNDAMENTAIS DA JUSTIÇA FEDERAL DA SEGUNDA REGIÃO",
                    style: 'cabecalho'
                },
                {
                    table: {
                        widths: ["20%", "65%", "15%"],
                        body: [
                            [
                                {text: "NUMERAÇÃO", style: 'titulo'},
                                {text: "NOMES", style: 'titulo'},
                                {text: "PROPOSTAS", style: 'titulo'},
                            ],
                            ...comites.map(c => [
                                {text: numeros[c.committee_id - 1], style: 'linhas'},
                                {text: c.committee_name, style: 'linhasEsquerda'},
                                {text: c.enunciados, style: 'linhas'},
                            ])
                        ]
                    }
                }
            ],
            styles: {
                titulo: {
                    bold: true, 
                    color: 'white', 
                    alignment: 'center',
                    fillColor: 'black'
                },
                linhas: {
                    bold: true, 
                    alignment: 'center',
                    margin: 10
                },
                linhasEsquerda: {
                    bold: true, 
                    alignment: 'left',
                    margin: 10
                },
                cabecalho: {
                    bold: true, 
                    decoration: 'underline',
                    margin: [50, 30, 50, 60],
                    alignment: 'center'
                }
            },
        });
        
        pdf.open();

    }catch(err){
        console.log(err);
    }

    
}

export default RelatorioQuantidadeEnunciados;