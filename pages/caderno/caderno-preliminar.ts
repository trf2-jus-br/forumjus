import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatarCodigo } from "../admissao/enunciado";
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


function gerarCaderno(ambiente: Ambiente, inscricoes : Inscricao[], comites: Comite[], titulo: string, preliminar: boolean, ocultarJustificativa: boolean){
    function comite(id : number){
        return comites.find(c => c.committee_id === id).committee_name;
    }

    const pdf = pdfMake.createPdf({
        pageMargins: [30, 30, 30, 30],
        footer: (currentPage, pageCount) => ({
            text: currentPage /* + '/' + pageCount*/,
            alignment: 'center' 
        }),
        content: [
            {
                image: `caderno_${preliminar? '' : 'plenaria_'}${inscricoes[0].committee_id}`,
                width: 595,
                margin: -30
            },
            {text: !preliminar ?  '' : ambiente.NOME, bold: true, fontSize: 14, alignment: 'center', marginBottom: 0},
            { text: titulo, bold: true, fontSize: 14, alignment: 'center', marginBottom: 35, marginTop: 50},

            //@ts-ignore
            ...inscricoes.sort((a, b) => {
                if(b.committee_id  < a.committee_id)
                    return 1;

                if(b.committee_id  > a.committee_id)
                    return -1;

                return b.codigo < a.codigo ? 1 : -1
            }).map((e, i) => {
                let body = [
                [ {
                    text: `${!preliminar ? (i+1).toString().padStart(2,"0") : formatarCodigo({committee_id: e.committee_id, codigo: e.codigo})}  ${comite(e.committee_id)}`, 
                    alignment: "center", 
                    fillColor: '#eeeeee',
                    border: [true, true, true, true]
                    } ],
                    [  {
                    text: "Enunciado", 
                    fontSize: 11,
                    marginTop: 10, 
                    preserveLeadingSpaces: true, 
                    lineHeight: 1.25,
                } ],
                [  {
                    text: e.statement_text.replaceAll('\n\n\n', '\n').replaceAll('\n\n','\n'), 
                    marginLeft: 20,
                    preserveLeadingSpaces: true, 
                    alignment: "justify", 
                    lineHeight: 1.25,
                    bold: true
                } ],
            ]

            if(!ocultarJustificativa){
                body.push([  {
                    text: "Justificativa",
                    fontSize: 11,
                    marginTop: 10, 
                    preserveLeadingSpaces: true, 
                    lineHeight: 1.25,
                } ])

                body.push([ {text: e.statement_justification.replaceAll('\n\n\n', '\n').replaceAll('\n\n','\n'), marginLeft: 20, marginBottom: 10, preserveLeadingSpaces: true, alignment: "justify", lineHeight: 1.25} ],)
            }

            body.push([ { text: `${moment(e.attendee_timestamp).format("DD/MM/YYYY")}`, alignment: "right", marginTop: 1, fontSize:10} ])



            return {   
                    unbreakable: true,
                    marginTop: 15,
                    table: {
                        unbreakable: true,
                        widths:["*"],
                        body,
                    },
                    layout: {
                        defaultBorder: false,
                    }
                    //pageBreak: 'after'
                }
            })
        ],
        images: {
            caderno_1 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/1.png`},
            caderno_2 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/2.png`},
            caderno_3 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/3.png`},
            caderno_4 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/4.png`},
            caderno_5 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/5.png`},
            caderno_6 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/6.png`},
            caderno_7 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/7.png`},

            caderno_plenaria_1 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/plenaria/1.png`},
            caderno_plenaria_2 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/plenaria/2.png`},
            caderno_plenaria_3 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/plenaria/3.png`},
            caderno_plenaria_4 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/plenaria/4.png`},
            caderno_plenaria_5 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/plenaria/5.png`},
            caderno_plenaria_6 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/plenaria/6.png`},
            caderno_plenaria_7 : { url: `${window.location.origin}/${ambiente.CAPAS_PREFIXO}/plenaria/7.png`},
        }
    })

    pdf.open();
}

export default gerarCaderno;