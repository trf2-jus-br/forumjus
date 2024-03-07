import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Capitalize } from "./string";
import { formatarCodigo } from "../pages/admissao/enunciado";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


interface Props {
    inscricoes : Inscricao[],
    comites: Comite[],
    membros: Membro[]
}

const ESQUERDA = [true, false, false, false];
const NENHUM = [false, false, true, false];

export function criarPDF(props: Props){
    const { 
        inscricoes,
        comites,
        membros
    } = props;

    const comite = comites.find(c => c.committee_id === membros[0].comite);
    const presidente = membros.find(m => m.funcao === "PRESIDENTA" || m.funcao === "PRESIDENTE");
    const relator = membros.find(m => m.funcao === "RELATOR" || m.funcao === "RELATORA");
    const especialista = membros.filter(m => m.funcao === "ESPECIALISTA");
    const jurista = membros.filter(m => m.funcao === "JURISTA");
    const participantes = membros.filter(m => m.funcao === "MEMBRO");

    const fillColor = '#eeeeee';

    const pdf = pdfMake.createPdf({
        pageMargins: [40, 40, 40, 40],
        footer: (currentPage, pageCount) => ({
            text: currentPage /* + '/' + pageCount*/,
            alignment: 'center' 
        }),
        content: [
            {
                image: `saia`,
                width: 595 - 80,
            },
            {text: `ATA DE OCORRÊNCIA DA COMISSÃO DE ${comite.committee_name.toUpperCase()}` , alignment: 'center', margin: 30, bold: true},
          
            {  
                width: 50, 
                table: {
                    dontBreakRows: true,
                    widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', 100],
                    body: [
                        [
                            {text: 'RIO DE JANEIRO', colSpan: 5, alignment: 'center', fillColor}, 
                            '','','','', 
                            {text: '3º ANDAR', colSpan: 5, alignment: 'center', fillColor}, 
                            '','','','', 
                        ],
                        [
                            {text: presidente.funcao === "PRESIDENTA" ? 'Presidenta' : 'Presidente', colSpan: 2, border: ESQUERDA}, '',
                            {text: presidente.nome, colSpan: 8, border: NENHUM}, '', '', '', '', '', '', '',
                        ],
                        [
                            {text: relator.funcao === "RELATOR" ? 'Relator' : 'Relatora', colSpan: 2, border: ESQUERDA}, '',
                            {text: relator.nome, colSpan: 8, border: NENHUM}, '', '', '', '', '', '', '',
                        ],
                        [
                            {text: especialista.length === 1 ? 'Especialista' : 'Especialistas', colSpan: 2, border: ESQUERDA}, '',
                            {text: especialista.map(e => e.nome).join('\n'), colSpan: 8, border: NENHUM}, '', '', '', '', '', '', '',
                        ],
                        [
                            {text: jurista.length === 1 ? 'Jurista' : 'Juristas', colSpan: 2, border: ESQUERDA, marginBottom: 7}, '',
                            {text: jurista.map(e => e.nome).join('\n'), colSpan: 8, border: NENHUM}, '', '', '', '', '', '', '',
                        ],
                        [
                            {text: 'Horário', colSpan: 2, alignment: 'center', fillColor},
                            '',
                            {text: 'Início', colSpan: 2, alignment: 'center', fillColor},
                            '',
                            {text: '', colSpan: 2},
                            '',
                            {text: 'Término', colSpan: 2, alignment: 'center', fillColor},
                            '',
                            {text: '', colSpan: 2},
                            ''
                        ],
                        [
                            {text: 'Eventuais Ocorrências:', colSpan: 10, marginBottom: 280},
                            '', '', '',
                            '', '', '',
                            '', '', '',
                        ],
                        [
                            {
                                width: '*',
                                text: `Assinatura do(a) Presidente`, 
                                colSpan: 4,
                                border: [true, true, false, false],
                                marginTop: 7,
                            },
                            '', '', '',
                            {
                                table: {
                                    heights: 7,
                                    widths: ['*'],
                                    body: [
                                        [{text: '', border: [false, false, false, true]}]
                                    ]
                                },
                                border: [false, false, true, false],
                                colSpan: 6,
                            },
                            '', '', '', '', '',
                        ],
                        [
                            {
                                text: `Assinatura do(a) Relator(a)`, 
                                colSpan: 4,
                                marginBottom: 7,
                                border: [true, false, false, true]
                            },
                            '', '', '', 
                            {
                                table: {
                                    heights: 7,
                                    widths: ['*'],
                                    body: [
                                        [{text: '', border: [false, false, false, true]}]
                                    ]
                                },
                                border: [false, false, true, true],
                                colSpan: 6,
                            },
                            '','', '', '','',
                        ]
                    ]
                },
            },
            {
                pageBreak: 'before',
                table: {
                    dontBreakRows: true,
                    widths: "*",
                    body: [
                        [
                            {text: 'Participantes Presentes', colSpan: 10, alignment: 'center', fillColor},
                            '', '',
                            '', '',
                            '', '',
                            '', '', 
                            {text: '',  alignment: 'center'}
                        ],
                        ...participantes.map( p => ([
                            {text: Capitalize(p.nome), colSpan: 9},
                            '', '',
                            '', '',
                            '', '',
                            '', '', 
                            {text: '(  )',  alignment: 'center'}
                        ])),
                        [
                            {text: 'Quantidade de participantes presentes na abertura dos trabalhos', marginBottom: 10, colSpan: 9, marginTop: 30},
                            '', '',
                            '', '',
                            '', '',
                            '', '', 
                            {text: '',  alignment: 'center'}
                        ]
                    ]
                }
            },
            {
                pageBreak: 'before',
                table: {
                    dontBreakRows: true,
                    headerRows: 1,
                    widths: [60, '*', 60],
                    body: [
                        [
                            {text:'Proposta aprovadas', colSpan: 3, alignment: 'center', fillColor},
                            '',''
                        ],
                        ...inscricoes.map( ({committee_id, codigo, statement_text}) =>([
                            {text: formatarCodigo({codigo, committee_id}) , colSpan: 1, alignment: 'center'},
                            {text: statement_text, colSpan: 1},
                            {text:'SIM  (  )\nNÃO (  )', colSpan: 1, alignment: 'center'},
                        ]))
                    ]
                },
            },
        ],
        images: {
            saia : { url: `${window.location.origin}/saia.png`},
        },
    });

    pdf.open()
}