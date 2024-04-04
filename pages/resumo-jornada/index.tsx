import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Cabecalho from '../votacao/cabecalho';
import Passo from './passo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { usarContexto } from '../../contexto';

interface Resumo {
    comites: Comite[];
    membros: Membro[];
    enunciados: {
        statement_text : string, 
        quorum: number, 
        favor: number
    }[]
}

function nomeFuncao(membros: Membro[]){
    switch(membros[0].funcao){
        case 'JURISTA': return membros.length == 1 ? 'Jurista' : 'Juristas';
        case 'PRESIDENTE': return 'Presidente';
        case 'PRESIDENTA': return 'Presidenta';
        case 'RELATOR': return membros.length == 1 ? 'Relator' : 'Relatores';
        case 'RELATORA': return membros.length == 1 ? 'Relatora' : membros.some(m => m.funcao === 'RELATOR') ? 'Relatores' : 'Relatoras'
        case 'ESPECIALISTA': return membros.length == 1 ? 'Especialista' : 'Especialistas';
    }
}

function ResumoJornada(){
    const [estagio, setEstagio] = useState(1);
    const [resumo, setResumo] = useState<Resumo>();

    const {api} = usarContexto();

    const tempos = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const enunciados_ = [1, 2, 3, 4, 5, 4, 5, 4, 5, 4, 5]

    const esperar = (tempo: number) => new Promise((resolve, reject)=> setTimeout(resolve, tempo));

    async function mudarEstagio(){
        for(let i = 1; i <= 7 + enunciados_.length; i++){
            setEstagio(i);
            await esperar(tempos[i] * 1000 || 3000)
        }
    }

    async function carregar(){
        try{
            const {data} = await api.get<Resumo>('/api/resumo-jornada');
            setResumo(data);
        }catch(err){

        }
    }

    useEffect(() => {
        carregar();
        mudarEstagio();
    }, [])

    if(!resumo)
        return <Layout cabecalho={<Cabecalho />} fluid></Layout> 


    const { comites, enunciados, membros } = resumo;

    const presidente = membros.filter(m => m.funcao === "PRESIDENTA" || m.funcao === "PRESIDENTE")[0];
    const relatores = membros.filter(m => m.funcao === "RELATOR" || m.funcao === "RELATORA");
    const especialistas = membros.filter(m => m.funcao === "ESPECIALISTA");
    const juristas = membros.filter(m => m.funcao === "JURISTA");

    return <Layout cabecalho={<Cabecalho />} fluid>
        {/*<Passo id={-1} atual={estagio}><div>Chegamos ao fim da Jornada</div></Passo>*/}
        <Passo id={0} atual={estagio}>
            <h4 className='text-center' style={{color: '#999'}}>{comites[0].committee_id}. {comites[0].committee_name}</h4>
        </Passo>
        <div className="row text-center">
            <div className="col-lg-3 col-12 mt-3">
                <h6>
                    {presidente.nome}
                </h6>
                
                <div style={{textTransform:"capitalize"}}>{presidente.funcao.toLowerCase()}</div>
            </div>        

            <div className="col-lg-3 col-12 mt-3">
                {relatores.map(
                    r => <h6 key={r.id}>
                        {r.nome}
                    </h6>
                )}
                <div style={{textTransform:"capitalize"}}>
                    {nomeFuncao(relatores)}
                </div>
            </div>    

            <div className="col-lg-3 col-12 mt-3">
                {especialistas.map(
                    r => <h6 key={r.id}>
                        {r.nome}
                    </h6>
                )}
                <div>{especialistas.length === 1 ? 'Especialista' : 'Especialistas'}</div>
            </div>    

            <div className="col-lg-3 col-12 mt-3">
                {juristas.map(
                    r => <h6 key={r.id}>
                        {r.nome}
                    </h6>
                )}
                <div>{juristas.length === 1 ? 'Jurista' : 'Juristas'}</div>
            </div>        
        </div>
        <div className='row mt-1'>
            <Passo id={3} atual={estagio}>
                <span className='font-weight-bold'>{enunciados.length}</span> proposições aprovadas
            </Passo>
        </div>
        
        <hr />
        
        <div className='resumo-jornada-enunciados'>
            {enunciados.map((e, i) => (
                <Passo className='resumo-jornada-enunciado' id={7 + i} atual={estagio} bloco>
                    <div className='row d-flex align-items-center' style={{textAlign:'justify', height:'99%'}}>
                        <div className='col-10'>{e.statement_text}</div>
                        <div className='col-2 d-flex justify-content-center' style={{gap: 20}}>
                            <div><FontAwesomeIcon color='#080' fontSize={15} icon={faThumbsUp} style={{marginRight: 5}}/>{Math.floor(100 * e.favor / e.quorum)}%</div>
                            <div><FontAwesomeIcon fontSize={18} icon={faPerson}  style={{marginRight: 5}}/>{e.quorum}</div>
                        </div>
                    </div>
                    <hr className='p-0 m-0'/>
                </Passo>
            ))}
        </div>

        

    </Layout>
}

export default ResumoJornada;