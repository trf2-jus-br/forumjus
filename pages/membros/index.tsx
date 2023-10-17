import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { usarContexto } from "../../contexto";
import { Form, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "../../components/tooltip";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


function Membros(){
    const [comites, setComites] = useState<Comite[]>();
    const [membros, setMembros] = useState<Membro[]>();
    const [filtro, setFiltro] = useState<number>();

    const { api, usuario } = usarContexto();

    async function carregar(){
        try{
            const { data : comites } = await api.get<Comite[]>('/api/comite');
            setComites(comites)

            setFiltro(comites[0].committee_id);

            const { data : membros } = await api.get<Membro[]>('/api/membro');
            setMembros(membros)

        }catch(err){
            alert(err);
        }
    }

    useEffect(()=>{
        carregar();
    }, [])


    if(!membros)
        return <></>

    const membro_filtrado = membros.filter(m => m.comite === filtro);

    const presidente = membro_filtrado.find(m => m.funcao === "PRESIDENTE");
    const relator = membro_filtrado.find(m => m.funcao === "RELATOR");

    const membros_comuns = membro_filtrado.filter(m => m.funcao === "MEMBRO");

    
    function gerarPdf(){
        const pdf = pdfMake.createPdf({
            pageMargins: [10+20, 30],
            header: {
                text: '',
                alignment: 'center',
                margin: 10
            },
            footer: (currentPage, pageCount) => ({
                text: currentPage + '/' + pageCount,
                alignment: 'center' 
            }),
            content: [
                { 
                    marginBottom: 20,
                    columns: [
                        [ 
                            {text: presidente.nome, alignment: "center", bold: true},
                            {text: "Presidente", alignment: "center"},
                        ],
                        [ 
                            {text: relator.nome, alignment: "center", bold: true},
                            {text: "Relator", alignment: "center"},
                        ],
                    ]
                },
                {
                    text: `${membros_comuns.length} membros`,
                    style: {bold: true}
                },
                {
                    layout: {
                        fillColor: (rowIndex, node,columnIndex )=>  (rowIndex % 2 === 0) ? '#dee2e6' : null ,
                        hLineColor: "#bbb",
                        vLineColor: "#bbb",
                    },
                    table: {
                        widths: ['*'],
                        headerRows: 1,
                        body: [
                            /*[ 
                                { text: 'Nome', style: 'header' } , 
                            ],*/
                            ...membros_comuns.map(m => (
                                [ m.nome ]
                            ))
                        ]
                    },
                    style: "table"
                }
            ],
            styles: {
                table: {
                    margin: [0, 10],
                },
                header: {
                    bold: true
                }
            }
        });

        pdf.open();
    }


    return <Layout>
        <div className='d-flex align-items-center justify-content-between'>
            <h4>Membros</h4>

            {comites?.length > 1 && usuario.permissoes.estatistica &&
                <Form.Select size="sm" value={filtro} style={{width: '40%'}} onChange={(e)=> setFiltro(parseInt(e.target.value))}>
                    {comites?.map( (c, i) => <option key={c.committee_id} value={c.committee_id}>{i + 1}. {c.committee_name}</option>)}
                </Form.Select>
            }
        </div>
        
        {/*
        <Tooltip mensagem="Gerar PDF">
            <FontAwesomeIcon onClick={gerarPdf} className="btn m-2 p-0" icon={faDownload} fontSize={18}/>
        </Tooltip>
        */}

        <div className="mt-4 d-flex justify-content-evenly w-100 text-center">
            <div>
                <h6>{presidente.nome}</h6>
                <div>Presidente</div>
            </div>        

            <div>
                <h6>{relator.nome}</h6>
                <div>Relator</div>
            </div>        
        </div>
        
        <h6 className="mt-4 mb-2">{membros_comuns.length} membros</h6>
        <Table striped>
            <thead>
                <tr>
                </tr>
            </thead>
            <tbody>
                {membros_comuns?.map(m => <tr key={m.id}>
                    <td>{m.nome}</td>
                </tr>)
                }
            </tbody>
        </Table>
    </Layout>
}

export default Membros;