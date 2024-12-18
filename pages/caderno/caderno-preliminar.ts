import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatarCodigo } from "../admissao/enunciado";
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


interface Config {
    ambiente: Ambiente, 
    inscricoes : Inscricao[], 
    comites: Comite[], 
    titulo: string, 
    preliminar: boolean, 
    exibir : {
        justificativas: boolean,
        nomes: boolean,
        cargos: boolean,
        datas: boolean,
    },
    gerarBlob?: boolean,
    capa: {url: string}
}

function gerarCaderno({ambiente, inscricoes, comites, titulo, preliminar, exibir, gerarBlob, capa, } : Config){
    function obterComite(id : number){
        return comites.find(c => c.committee_id === id);
    }

    const pdf = pdfMake.createPdf({
        pageMargins: [30, 30, 30, 30],
        footer: (currentPage, pageCount) => ({
            text: currentPage /* + '/' + pageCount*/,
            alignment: 'center' 
        }),
        content: [
            {
                image: 'capa',
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
                    text: `${!preliminar ? (i+1).toString().padStart(2,"0") : formatarCodigo({committee_id: e.committee_id, codigo: e.codigo})}  ${obterComite(e.committee_id).committee_name}`, 
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

            if(exibir.justificativas){
                body.push([  {
                    text: "Justificativa",
                    fontSize: 11,
                    marginTop: 10, 
                    preserveLeadingSpaces: true, 
                    lineHeight: 1.25,
                } ])

                body.push([ {text: e.statement_justification.replaceAll('\n\n\n', '\n').replaceAll('\n\n','\n'), marginLeft: 20, marginBottom: 10, preserveLeadingSpaces: true, alignment: "justify", lineHeight: 1.25} ],)
            }


            if(exibir.nomes){
                body.push([ { text: e.attendee_name, alignment: "right", bold:true, marginTop: 1}  ])
            }
               
            if(exibir.cargos){
                if(e.occupation_name !== "Outros")
                    body.push([ { text: e.occupation_name, alignment: "right", marginTop: 1}  ],)

                if(e.attendee_affiliation?.trim()?.length)
                    body.push([ { text: e.attendee_affiliation, alignment: "right", marginTop: 1}  ]);
            }
            
            if(exibir.datas)
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
            capa
        }
    })

    if(gerarBlob === true){
        return new Promise((resolve, reject)=>{
            pdf.getBlob((blob)=>{
                resolve(blob);
            })
        })
    }else{
        pdf.open();

    }
}

export default gerarCaderno;