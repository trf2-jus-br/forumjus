import React, { useRef } from 'react';
import ModalRegimento from '../components/modalRegimento';
import {carregarEsquema} from '../migracoes/esquemas'

export async function getServerSideProps(context) {
  const esquema = await carregarEsquema(context.req);

  if(esquema.match('[^a-zA-Z0-9]'))
    throw `Esquema não permitido ${host}`;

  return { props: {
    esquema
  }};
}

export default function Home(props) {

  const regimentoRef = useRef();
  return <>
    <div className="container content">
      <div className="px-4 py-5 my-5 text-center">
        <div className="col-lg-6 mx-auto">
        <img className='w-100' title={props.esquema} src="/saia.png" />
          <p className="lead mb-4 mt-4">Sistema desenvolvido para receber inscrição de proposta(s) de enunciado(s) para a I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região.</p>

          <p className="lead mb-4 mt-4">Para mais informações, visite o <a href="https://www10.trf2.jus.br/institucional/forum-de-direitos-humanos-e-fundamentais/" target='_blank' rel="noopener">Portal do Fórum de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região</a> e leia o <a href="#regimento" onClick={()=> regimentoRef.current.show()}>Regimento da Jornada</a>.</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a className="btn btn-primary btn-lg px-4" href="register" style={{ "color": "white" }}>Inscrição</a>
          </div>
        </div>
      </div>
    </div>
    <ModalRegimento ref={regimentoRef} />
  </>
}
