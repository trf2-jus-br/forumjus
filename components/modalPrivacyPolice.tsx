import { Modal } from "react-bootstrap"
import React, { useImperativeHandle, useState } from "react"
import { usarContexto } from "../contexto"

function PrivacyPolicy(props, ref){
    const [show, setShow] = useState(false)

    const { ambiente } = usarContexto();

    useImperativeHandle(ref, ()=>({
        show : () => setShow(true)
    }))

    return <Modal show={show} onHide={()=> setShow(false)} size="xl">
        <Modal.Header closeButton>
            <Modal.Title>Política de Privacidade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>
                Em consonância com a <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel='noopener'>Lei nº. 13.709/18 - Lei Geral de Proteção de Dados Pessoais</a>, esta política de privacidade destina-se a ajudar você a entender quais informações coletamos e por que as coletamos.
            </p>
            
            <h6>Fórumjus</h6>
            <p style={{marginLeft:20}}>
                Sistema desenvolvido para receber inscrições de propostas de enunciados para a {ambiente.NOME}.
            </p>
            <h6>Dados pessoais</h6>
            <p style={{marginLeft:20}}>
                Dados pessoais são coletados, armazenados e processados com o objetivo de viabilizar a realização do evento, dentre as ações realizadas estão:
                <ul>
                    <li>Realizar as adaptações necessárias, para garantir a inclusão de todos;</li>
                    <li>Contactar os participamentes;</li>
                    <li>Realizar as votações</li>
                    <li>Organizar a realização da Jornada</li>
                </ul>
            </p>
            <h6>Termo de uso</h6>
            <p style={{marginLeft:20}}>Eu autorizo o armazenamento e o processamento dos dados pessoais informados acima, de acordo com as exigências da Lei nº. 13.709/18 - Lei Geral de Proteção de Dados Pessoais, para as finalidades da {ambiente.NOME}</p>
        </Modal.Body>
    </Modal>
}

export default React.forwardRef(PrivacyPolicy);