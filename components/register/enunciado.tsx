import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React from 'react'
import { FieldArray } from 'formik';

import type {FormikProps} from "formik/dist/types"

type Props = FormikProps<typeof valor> &  {
    handleChangeAttendeePhone: (valor : string)=> string,
    handleChangeAttendeeDocument: (valor : string)=> string,
    disabled: boolean,
    forumConstants: any
}

export const valor = {
    attendeeName: '',
    attendeeChosenName: '',
    attendeeEmail: '',
    attendeeEmailConfirmation: '',
    attendeePhone: '',
    attendeeDocument: '',
    attendeeOccupationId: undefined,
    attendeeOccupationOther: '',
    attendeeOccupationAffiliation: '',
    attendeeDisabilityYN: false,
    attendeeDisability: '',
    attendeeAffiliation: undefined,
    statement: [{
      text: '',
      justification: '',
      committeeId: undefined
    }]
}

function Enunciado({values, errors, handleChange, touched, handleChangeAttendeePhone, handleChangeAttendeeDocument, disabled, forumConstants} : Props){
    return (
        <FieldArray name="statement">
            {({ insert, remove, push, pop }) => (
            <div>
                {values.statement.length > 0 && values.statement.map((s, i) =>
                (
                <div className="row" key={i}>
                    {!disabled &&  
                    <div className="col col-12">
                        <h3>Enunciado {values.statement.length > 1 ? i + 1 : ''}</h3>
                    </div>}
                    

                    <div className="col col-12 col-lg-6">
                    <Form.Group className="mb-3" controlId={`statement[${i}].committeeId`}>
                        <Form.Label>Comissão</Form.Label>
                        <Form.Control as="select" value={values.statement[i].committeeId} onChange={(evt, i) => handleChange(evt, i)} isValid={touched.attendeeName && !(errors && errors.statement && errors.statement[i] && errors.statement[i].committeeId)} isInvalid={touched.attendeeName && errors && errors.statement && errors.statement[i] && errors.statement[i].committeeId}  >
                        <option value hidden={values.statement[i].committeeId}>[Selecione]</option>
                        {Object.keys(forumConstants.committee).map((ci) => (<option value={ci}>{forumConstants.committee[ci].name}</option>))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{errors && errors.statement && errors.statement[i] && errors.statement[i].committeeId}</Form.Control.Feedback>
                    </Form.Group>
                    </div>

                    <div className="col align-self-end">
                    {i > 0 && i == (values.statement.length - 1) ?
                        <Button variant="secondary" onClick={() => pop()} className="mb-3" style={{ marginRight: '1em' }}>
                        Remover Enunciado {i + 1}
                        </Button>
                        : <></>}
                    {i == (values.statement.length - 1) && i < 2 ?
                        <Button variant="secondary" onClick={() => push({
                        text: '',
                        justification: '',
                        committeeId: undefined
                        })} className="mb-3">
                        Adicionar Enunciado {i + 2}
                        </Button>
                        : <></>}
                    </div>

                    <div className="w-100 d-none d-md-block"></div>
                    <div className="col col-12 col-md-6">
                    <Form.Group className="mb-3" controlId={`statement[${i}].text`}>
                        <Form.Label>Enunciado</Form.Label>
                        <Form.Control as="textarea" rows="10" value={values.statement[i].text} onChange={(evt, i) => handleChange(evt, i)} isValid={touched.attendeeName && !(errors && errors.statement && errors.statement[i] && errors.statement[i].text)} isInvalid={touched.attendeeName && errors && errors.statement && errors.statement[i] && errors.statement[i].text} />
                        <Form.Control.Feedback type="invalid">{errors && errors.statement && errors.statement[i] && errors.statement[i].text}</Form.Control.Feedback>
                        <Form.Text className="text-muted">Escreva um texto de no máximo 800 caracteres.</Form.Text>
                    </Form.Group>
                    </div>
                    <div className="col col-12 col-md-6">
                    <Form.Group className="mb-3" controlId={`statement[${i}].justification`}>
                        <Form.Label>Justificativa</Form.Label>
                        <Form.Control as="textarea" rows="10" value={values.statement[i].justification} onChange={(evt, i) => handleChange(evt, i)} isValid={touched.attendeeName && !(errors && errors.statement && errors.statement[i] && errors.statement[i].justification)} isInvalid={touched.attendeeName && errors && errors.statement && errors.statement[i] && errors.statement[i].justification} />
                        <Form.Control.Feedback type="invalid">{errors && errors.statement && errors.statement[i] && errors.statement[i].justification}</Form.Control.Feedback>
                        <Form.Text className="text-muted">Escreva uma justificativa para o enunciado de no máximo 1600 caracteres.</Form.Text>
                    </Form.Group>
                    </div>
                </div>
                )

                )}
            </div>
            )}
        </FieldArray>
    )
}

export default Enunciado