import React, { useImperativeHandle, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface Acoes {
    resolve : (txt: string) => void;
    reject : () => void;
}

function ModalJustificativa(props, ref){
    const [justificativa, setJustificativa] = useState("");
    const [acoes, setAcoes] = useState<Acoes>(null);
    const [obrigatorio, setObrigatorio] = useState(true);

    function cancelar(){
        acoes.reject();
        setAcoes(null);
    }

    function confirmar(){
        acoes.resolve(justificativa);
        setAcoes(null);
    }

    useImperativeHandle(ref, ()=>({
        exibir: (justificativa, obrigatorio) => new Promise((resolve, reject)=>{
            setJustificativa(justificativa || "");
            setAcoes({resolve, reject});
            setObrigatorio(obrigatorio);
        })
    }))

    return <Modal size='lg' className='user-select-none' show={acoes !== null} onHide={cancelar}>
        <Modal.Header closeButton>
            <Modal.Title>Justificativa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control as="textarea" maxLength={512} rows="10" value={justificativa} onChange={({target}) => setJustificativa(target.value)} />
            <Form.Text className="text-muted text-end d-block mb-3">Justifique a decisão em até 512 caracteres.</Form.Text>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={cancelar}>Cancelar</Button>
            <Button variant="primary" onClick={confirmar} disabled={obrigatorio && justificativa.trim().length === 0}>OK</Button>
        </Modal.Footer>
    </Modal>
}

export default React.forwardRef(ModalJustificativa);