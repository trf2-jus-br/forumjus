import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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
    const [editingCommittee, setEdittingCommittee] = useState(null)

    function selectCommittee(committee_id, setFieldValue){
        setFieldValue(`statement.${editingCommittee}.committeeId`, committee_id)
        setEdittingCommittee(null)
      }
    
      function renderCommittee(id){
        if(id === undefined)
          return  <div>[Selecione]</div>;
    
        const committee = forumConstants.committee[id]
        
        return <div className='p-1'>
          <h6>{committee.name}</h6>
          <div style={{paddingLeft: "20px"}}>{committee.description}</div>
        </div>
      }

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
                    

                    <div className="col col-12 col-lg-12">
                            <Form.Group className="mb-3" controlId={`statement[${i}].committeeId`}>
                              <Form.Label>Comissão</Form.Label>
                              <div className="custom-select" onClick={()=> setEdittingCommittee(i)}>
                                <div className={`form-control ${touched.statement && touched.statement[i] && errors.statement && errors.statement[i] && errors.statement[i].committeeId && 'border-danger'}`}>
                                  {renderCommittee(values.statement[i].committeeId)}
                                </div>
                              </div>
                              <Form.Control className="d-none" as="select" value={values.statement[i].committeeId} onChange={(evt, i) => handleChange(evt, i)} isValid={touched.attendeeName && !(errors && errors.statement && errors.statement[i] && errors.statement[i].committeeId)} isInvalid={touched.attendeeName && errors && errors.statement && errors.statement[i] && errors.statement[i].committeeId}  >
                                <option value hidden={values.statement[i].committeeId}>[Selecione]</option>
                                {Object.keys(forumConstants.committee).map((ci) => (<option key={ci} value={ci}>{forumConstants.committee[ci].name}</option>))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">{errors && errors.statement && errors.statement[i] && errors.statement[i].committeeId}</Form.Control.Feedback>
                            </Form.Group>
                          </div>


                    <div className="w-100 d-none d-md-block"></div>
                    <div className="col col-12 col-md-6">
                    <Form.Group className="mb-3" controlId={`statement[${i}].text`}>
                        <Form.Label>Enunciado</Form.Label>
                        <Form.Control as="textarea" rows="9" value={values.statement[i].text} onChange={(evt, i) => handleChange(evt, i)} isValid={touched.attendeeName && !(errors && errors.statement && errors.statement[i] && errors.statement[i].text)} isInvalid={touched.attendeeName && errors && errors.statement && errors.statement[i] && errors.statement[i].text} />
                        <Form.Control.Feedback type="invalid">{errors && errors.statement && errors.statement[i] && errors.statement[i].text}</Form.Control.Feedback>
                        <Form.Text className="text-muted">Escreva um texto de no máximo 800 caracteres.</Form.Text>
                    </Form.Group>
                    </div>
                    <div className="col col-12 col-md-6">
                    <Form.Group className="mb-3" controlId={`statement[${i}].justification`}>
                        <Form.Label>Justificativa</Form.Label>
                        <Form.Control as="textarea" rows="9" value={values.statement[i].justification} onChange={(evt, i) => handleChange(evt, i)} isValid={touched.attendeeName && !(errors && errors.statement && errors.statement[i] && errors.statement[i].justification)} isInvalid={touched.attendeeName && errors && errors.statement && errors.statement[i] && errors.statement[i].justification} />
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