import { Modal } from "react-bootstrap"
import React, { useImperativeHandle, useState } from "react"
import { usarContexto } from "../contexto"

function Regimento(props, ref){
    const [show, setShow] = useState(false)

    const {ambiente} = usarContexto();

    useImperativeHandle(ref, ()=>({
        show : () => setShow(true)
    }))


    return <Modal show={show} onHide={()=> setShow(false)} size="xl">
        <Modal.Header closeButton>
            <Modal.Title>Política de Privacidade</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{height: "calc(100vh - 135px)"}} >
            <iframe src={ambiente.REGULAMENTO} width='100%' style={{height: 'calc(100% - 20px)'}} ></iframe>
        </Modal.Body>
    </Modal>
}

export default React.forwardRef(Regimento);