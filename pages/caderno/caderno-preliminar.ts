import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatarCodigo } from "../admissao/enunciado";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


function gerarCadernoPreliminar(inscricoes : Inscricao[], comites: Comite[], titulo: string){
    function comite(id : number){
        return comites.find(c => c.committee_id === id).committee_name;
    }

    const pdf = pdfMake.createPdf({
        pageMargins: [40, 40, 40, 40],
        footer: (currentPage, pageCount) => ({
            text: currentPage /* + '/' + pageCount*/,
            alignment: 'center' 
        }),
        content: [
            {text: 'I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região', bold: true, fontSize: 14, alignment: 'center', marginBottom: 0},
            { text: titulo, bold: true, fontSize: 14, alignment: 'center', marginBottom: 35, marginTop: 50},

            //@ts-ignore
            ...inscricoes.map((e, i) => (
                {   
                    unbreakable: true,
                    marginTop: 15,
                    table: {
                        unbreakable: true,
                        widths:["*"],
                        body: [
                            [ {text: `${formatarCodigo(e)}  ${comite(e.committee_id)}`, alignment: "center", fillColor: '#eeeeee' } ],
                            [  {text: e.statement_text, marginTop: 10, preserveLeadingSpaces: true, alignment: "justify", lineHeight: 1.25} ],
                            [ {text: e.statement_justification, marginTop: 10, marginBottom: 10, preserveLeadingSpaces: true, alignment: "justify", lineHeight: 1.25} ],
                            [ { text: e.attendee_name, alignment: "right", bold:true, marginTop: 1}  ],
                        ],
                    },
                    layout: 'noBorders',
                    //pageBreak: 'after'
                }
            ))
        ]
    })

    pdf.open();
}

export default gerarCadernoPreliminar;