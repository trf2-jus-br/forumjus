import React, { useRef } from 'react';
import ModalRegimento from '../components/modalRegimento';
import { usarContexto } from '../contexto';

export default function Home() {
  const { ambiente } = usarContexto();

  const regimentoRef = useRef();
  return <>
    <div className="container content">
      <div className="px-4 py-5 my-5 text-center">
        <div className="col-lg-6 mx-auto">
        <img className='w-100' src={`/api/uploads/${ambiente.BANNER}`} />
          <p className="lead mb-4 mt-4">Sistema desenvolvido para receber inscrição de proposta(s) de enunciado(s) para a {ambiente.NOME}</p>

          <p className="lead mb-4 mt-4">Para mais informações, visite o <a href={ambiente.PORTAL_LINK} target='_blank' rel="noopener">{ambiente.PORTAL}</a> e leia o <a href="#regimento" onClick={()=> regimentoRef.current.show()}>Regimento da Jornada</a>.</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a className="btn btn-primary btn-lg px-4" href="register" style={{ "color": "white" }}>Inscrição</a>
          </div>
        </div>
      </div>
    </div>
    <ModalRegimento ref={regimentoRef} />
  </>
}
