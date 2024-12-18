import { Form } from "react-bootstrap";

interface Props {
    valor: boolean, 
    onChange: Function, 
    titulo: string
}

function CheckBox({valor, onChange, titulo}: Props){
    return <label className='d-flex flex-row justify-content-center'>
        <Form.Check style={{paddingRight: 10}}>
            <Form.Check.Input type="checkbox" checked={valor} onChange={(v) => onChange(v.target.checked)}/>
        </Form.Check>
        {titulo}
    </label>
}

export default CheckBox;