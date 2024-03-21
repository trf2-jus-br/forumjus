import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Cabecalho from '../votacao/cabecalho';
import Passo from './passo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPercent, faPercentage, faPerson, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function ResumoJornada(){
    const [estagio, setEstagio] = useState(1);

    const tempos = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const enunciados = [1, 2, 3, 4, 5, 4, 5, 4, 5, 4, 5]

    const esperar = (tempo: number) => new Promise((resolve, reject)=> setTimeout(resolve, tempo));

    async function mudarEstagio(){
        for(let i = 1; i <= 7 + enunciados.length; i++){
            setEstagio(i);
            await esperar(tempos[i] * 1000 || 3000)
        }
    }

    useEffect(() => {
        mudarEstagio();
    }, [])


    return <Layout cabecalho={<Cabecalho />} fluid>
        {/*<Passo id={-1} atual={estagio}><div>Chegamos ao fim da Jornada</div></Passo>*/}
        <Passo id={0} atual={estagio}>
            <div className='text-center'>Combate ao assédio e à discriminação por gênero ou orientação sexual</div>
        </Passo>
        <div className='row mb-3'>
            <div className='col-5'>
                <Passo id={2} atual={estagio}><div>Presidente: AAAA</div></Passo>
                <Passo id={3} atual={estagio}><div>Relator: AAAA</div></Passo>
                <Passo id={4} atual={estagio}><div>Especialista: AAAA</div></Passo>
                <Passo id={5} atual={estagio}><div>Jurista: AAAA</div></Passo>
            </div>
            <div className='col-7 text-end mb-5'>
                <Passo id={2} atual={estagio}><div>385 proposições recebidas</div></Passo>
                <Passo id={3} atual={estagio}><div>85 Proposições aprovadas</div></Passo>
            </div>
        </div>
        
        <hr />
        
        <div style={{overflow: 'hidden', height: 400}}>
            {enunciados.map((e, i) => (
                <Passo id={7 + i} atual={estagio} bloco>
                    <div className='row' style={{textAlign:'justify'}}>
                        <div className='col-11'>A comercialização de dispositivos neurotecnológicos infanto-juvenis e o uso de técnicas de imagem cerebral em crianças e adolescentes para fins diversos da pesquisa científica e dos tratamentos médicos são incompatíveis com o texto constitucional vigente.</div>
                        <div className='col-1'>
                            <div><FontAwesomeIcon color='#080' fontSize={15} icon={faThumbsUp} style={{marginRight: 5}}/>75%  </div>
                            <div><FontAwesomeIcon fontSize={18} icon={faPerson}  style={{marginRight: 5}}/> 8</div>
                        </div>
                    </div>
                    <hr />
                </Passo>
            ))}
        </div>

        

    </Layout>
}

export default ResumoJornada;