import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { CloseButton, Toast, ToastContainer } from 'react-bootstrap';

type MensagemGerenciavel = Mensagem & {
  identificador : number,
  oculto: boolean,
}

function ModalError(props, ref) {
  const [mensagens, setMensagens] = useState<MensagemGerenciavel[]>([]);

  useImperativeHandle(ref, () => ({
    exibir: function (msg: Mensagem) {
      setMensagens([...mensagens, {
        ...msg,
        identificador: new Date().getTime(),
        oculto: false 
      }])
    }  
  }))

  useEffect(()=>{
    const interval = setInterval(()=> {
      const tick = new Date().getTime();
      const filtro = m => tick - m.identificador < 3000;

      setMensagens( mensagens => {


        return mensagens
        .map( m => {
              m.oculto = tick - m.identificador > 2500;
              return m;
        })
        .filter(filtro);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [])

  function fechar(identificador){
    const indice = mensagens.findIndex(m => m.identificador === identificador);
    setMensagens(m => {
      m.splice(indice, 1)

      console.log(m)
      return [...m];
    })
  }

  return (
    <ToastContainer className='position-fixed p-3' style={{right: 20, bottom: 20}}>
      {mensagens.map(m => (
        <Toast key={m.identificador} bg={m.tipo === "ERRO" ? 'danger' : 'success'} style={{opacity: m.oculto? 0 : 1, transition: 'opacity 0.3s'}}>
          <Toast.Body className='d-flex justify-content-between' >
              <span className='d-flex align-items-center w-100'>
                <span>
                  <div style={{color: '#fff', marginLeft: 0, fontWeight: 400, fontSize: 15}}>{m.titulo}</div>
                  <div style={{color: '#fff', marginLeft: 15}}>{m.texto}</div>
                </span>
              </span>

              <CloseButton 
                variant="white" 
                style={{color:'white'}} 
                onClick={()=> fechar(m.identificador)}
              />
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  )
}

export default React.forwardRef(ModalError)