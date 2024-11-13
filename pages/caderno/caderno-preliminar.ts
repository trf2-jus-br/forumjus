import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatarCodigo } from "../admissao/enunciado";
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;



function gerarCaderno(ambiente: Ambiente, inscricoes : Inscricao[], comites: Comite[], titulo: string, preliminar: boolean, ocultarJustificativa: boolean, gerarBlob?: boolean){
    function url(img){
        return {url: `${window.location.origin}/api/uploads/${img}`};
    }

    function obterComite(id : number){
        return comites.find(c => c.committee_id === id);
    }

    const comite = obterComite(inscricoes[0].committee_id);

    if(!comite?.capa_proposta_recebida || !comite?.capa_proposta_plenaria){
        throw "Capas não foram configuradas corretamente";
    }    

    const pdf = pdfMake.createPdf({
        pageMargins: [30, 30, 30, 30],
        footer: (currentPage, pageCount) => ({
            text: currentPage /* + '/' + pageCount*/,
            alignment: 'center' 
        }),
        content: [
            {
                image: preliminar ? 'capa_proposta_recebida' : 'capa_proposta_plenaria',
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
            capa_proposta_recebida: url(comite.capa_proposta_recebida),
            capa_proposta_admitida: url(comite.capa_proposta_admitida || comite.capa_proposta_recebida),
            capa_proposta_comissao: url(comite.capa_proposta_comissao || comite.capa_proposta_recebida),
            capa_proposta_plenaria: url(comite.capa_proposta_plenaria),
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