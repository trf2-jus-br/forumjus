import React, { useState, useImperativeHandle } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalError(props, ref) {
  const [mensagem, setMensagem] = useState<Mensagem>(null);

  useImperativeHandle(ref, () => ({
    exibir: (msg: Mensagem) =>  setMensagem(msg)
  }))


  function fechar(){
    if(mensagem.acao)
      mensagem.acao();

    setMensagem(null)
  }

  return (
    <>
      <Modal show={mensagem !== null} onHide={fechar}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">{mensagem?.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{mensagem?.texto}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={fechar}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default React.forwardRef(ModalError)