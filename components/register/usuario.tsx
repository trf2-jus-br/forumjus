import React from 'react';
import Form from 'react-bootstrap/Form';

import type {FormikProps} from "formik/dist/types"

type Props = FormikProps<typeof valor> &  {
    handleChangeAttendeePhone: (valor : string)=> string,
    handleChangeAttendeeDocument: (valor : string)=> string,
    disabled: boolean
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


function Usuario({values, errors, handleChange, touched, handleChangeAttendeePhone, handleChangeAttendeeDocument, disabled} : Props){
    return <div className="row">
    <div className="col col-12 col-lg-6">
      <Form.Group className="mb-3" controlId="attendeeName">
        <Form.Label>Nome Completo</Form.Label>
        <Form.Control type="text" value={values.attendeeName} onChange={handleChange} isValid={touched.attendeeName && !errors.attendeeName} isInvalid={touched.attendeeName && errors.attendeeName} disabled={disabled}/>
        <Form.Control.Feedback type="invalid">{errors.attendeeName}</Form.Control.Feedback>
      </Form.Group>
    </div>
    <div className="col col-12 col-lg-6">
      <Form.Group className="mb-3" controlId="attendeeChosenName">
        <Form.Label>Nome Social (opcional)</Form.Label>
        <Form.Control type="text" value={values.attendeeChosenName} onChange={handleChange} isValid={touched.attendeeChosenName && !errors.attendeeChosenName} isInvalid={touched.attendeeChosenName && errors.attendeeChosenName} disabled={disabled}/>
        <Form.Control.Feedback type="invalid">{errors.attendeeChosenName}</Form.Control.Feedback>
      </Form.Group>
    </div>
    <div className="col col-12 col-lg-3">
      <Form.Group className="mb-3" controlId="attendeeEmail">
        <Form.Label>E-mail</Form.Label>
        <Form.Control type="email" value={values.attendeeEmail} onChange={handleChange} isValid={touched.attendeeEmail && !errors.attendeeEmail} isInvalid={touched.attendeeEmail && errors.attendeeEmail} disabled={disabled}/>
        <Form.Control.Feedback type="invalid">{errors.attendeeEmail}</Form.Control.Feedback>
      </Form.Group>
    </div>
    <div className="col col-12 col-lg-3">
      <Form.Group className="mb-3" controlId="attendeeEmailConfirmation">
        <Form.Label>Confirmação de E-mail</Form.Label>
        <Form.Control type="email" value={values.attendeeEmailConfirmation} onChange={handleChange} isValid={touched.attendeeEmailConfirmation && !errors.attendeeEmailConfirmation} isInvalid={touched.attendeeEmailConfirmation && errors.attendeeEmailConfirmation} disabled={disabled}/>
        <Form.Control.Feedback type="invalid">{errors.attendeeEmailConfirmation}</Form.Control.Feedback>
      </Form.Group>
    </div>
    <div className="col col-12 col-lg-3">
      <Form.Group className="mb-3" controlId="attendeePhone">
        <Form.Label>Telefone</Form.Label>
        <Form.Control type="text" value={values.attendeePhone} onChange={(evt) => { evt.target.value = handleChangeAttendeePhone(evt.target.value); handleChange(evt) }} isValid={touched.attendeePhone && !errors.attendeePhone} isInvalid={touched.attendeePhone && errors.attendeePhone} disabled={disabled}/>
        <Form.Control.Feedback type="invalid">{errors.attendeePhone}</Form.Control.Feedback>
      </Form.Group>
    </div>
    <div className="col col-12 col-lg-3">
      <Form.Group className="mb-3" controlId="attendeeDocument">
        <Form.Label>CPF</Form.Label>
        <Form.Control type="text" value={values.attendeeDocument} onChange={(evt) => { evt.target.value = handleChangeAttendeeDocument(evt.target.value); handleChange(evt) }} isValid={touched.attendeeDocument && !errors.attendeeDocument} isInvalid={touched.attendeeDocument && errors.attendeeDocument} disabled={disabled}/>
        <Form.Control.Feedback type="invalid">{errors.attendeeDocument}</Form.Control.Feedback>
      </Form.Group>
    </div>
    <div className="col col-12 col-lg-3">
      <Form.Group className="mb-3" controlId="attendeeOccupationId">
        <Form.Label>Profissão</Form.Label>
        <Form.Control as="select" value={values.attendeeOccupationId} onChange={handleChange} isValid={touched.attendeeOccupationId && !errors.attendeeOccupationId} isInvalid={touched.attendeeOccupationId && errors.attendeeOccupationId} disabled={disabled}>
          <option value={null} hidden={values.attendeeOccupationId != null}>[Selecione]</option>
          <option value="1">Magistrado(a)</option>
          <option value="2">Procurador(a)</option>
          <option value="3">Integrante da Administração Pública</option>
          <option value="4">Advogado(a)</option>
          <option value="5">Acadêmico(a)</option>
          <option value="6">Outros</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">{errors.attendeeOccupationId}</Form.Control.Feedback>
      </Form.Group>
    </div>
    <div className="col col-12 col-lg-6">
      <Form.Group className="mb-3" controlId="attendeeAffiliation">
        <Form.Label>Vinculado a Qual Órgão? (se for o caso)</Form.Label>
        <Form.Control type="text" value={values.attendeeAffiliation} onChange={(evt) => { handleChange(evt) }} isValid={touched.attendeeOccupationId && !errors.attendeeAffiliation} isInvalid={touched.attendeeOccupationId && errors.attendeeAffiliation} disabled={disabled}/>
        <Form.Control.Feedback type="invalid">{errors.attendeeAffiliation}</Form.Control.Feedback>
      </Form.Group>
    </div>
    {false && values.attendeeOccupationId === '6' ?
      (<div className="col col-12 col-lg-6">
        <Form.Group className="mb-3" controlId="attendeeOccupationOther">
          <Form.Label>Descrever a Categoria</Form.Label>
          <Form.Control type="text" value={values.attendeeOccupationOther} onChange={handleChange} isValid={touched.attendeeOccupationId && !errors.attendeeOccupationOther} isInvalid={touched.attendeeOccupationId && errors.attendeeOccupationOther} disabled={disabled}/>
          <Form.Control.Feedback type="invalid">{errors.attendeeOccupationOther}</Form.Control.Feedback>
        </Form.Group>
      </div>) : <></>
    }

    <div className="col col-12 col-lg-3">
      <Form.Group className="mb-3" controlId="attendeeDisabilityYN">
        <Form.Label>Pessoa com Deficiência</Form.Label>
        <Form.Control as="select" value={values.attendeeDisabilityYN} onChange={(evt) => { evt.target.value = !!(evt.target.value === 'true' || evt.target.value === true); handleChange(evt) }} isValid={touched.attendeeDisabilityYN && !errors.attendeeDisabilityYN} isInvalid={touched.attendeeDisabilityYN && errors.attendeeDisabilityYN} disabled={disabled} >
          <option value={false}>Não</option>
          <option value={true}>Sim</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">{errors.attendeeDisabilityYN}</Form.Control.Feedback>
      </Form.Group>
    </div>
    {values.attendeeDisabilityYN === true || values.attendeeDisabilityYN === 'true' ?
      (<div className="col col-12 col-lg-6">
        <Form.Group className="mb-3" controlId="attendeeDisability">
          <Form.Label>Descrever a Necessidade de Atendimento Especial</Form.Label>
          <Form.Control type="text" value={values.attendeeDisability} onChange={handleChange} isValid={touched.attendeeDisability && !errors.attendeeDisability} isInvalid={touched.attendeeDisability && errors.attendeeDisability} disabled={disabled}/>
          <Form.Control.Feedback type="invalid">{errors.attendeeDisability}</Form.Control.Feedback>
        </Form.Group>
      </div>) : <></>
    }
  </div>
}

export default Usuario;