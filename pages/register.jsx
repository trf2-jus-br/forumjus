import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useRef, useState } from 'react'
import Fetcher from '../utils/fetcher'
import Layout from '../components/layout'
import ReCAPTCHA from "react-google-recaptcha";
import * as formik from 'formik';
import { registerSchema } from '../utils/schema';
import mysql from "../utils/mysql"
import { Modal } from 'react-bootstrap';
import PrivacyPolicy from '../components/modalPrivacyPolice';
import Regimento from '../components/modalRegimento';

const recaptchaRef = React.createRef();

export async function getServerSideProps({ params }) {
  return {
    props: {
      API_URL_BROWSER: process.env.API_URL_BROWSER,
      forumConstants: await mysql.loadForumConstants(1)
    },
  };
}


export default function Create(props) {
  const [attendeeEmail, setAttendeeEmail] = useState(undefined)
  const [created, setCreated] = useState(false)
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [editingCommittee, setEdittingCommittee] = useState(null)
  const { Formik, FieldArray } = formik;

  const privacyPolicyRef = useRef()
  const regimentoRef = useRef();

  const handleChangeAttendeePhone = (evt) => {
    let data = event.target.value.replace(/\D/g, "");
    if (data.length > 11) data = data.substr(0, 11)
    data = data.replace(/\D/g, '')
    data = data.replace(/(\d{2})(\d)/, "($1) $2")
    data = data.replace(/(\d)(\d{4})$/, "$1-$2")
    return data
  };
  const handleChangeAttendeeDocument = (evt) => {
    // Get only the numbers from the data input
    let data = event.target.value.replace(/\D/g, "");
    // Checking data length to define if it is cpf or cnpj
    if (data.length > 11) data = data.substr(0, 11)
    // It's cpf
    let cpf = "";
    let parts = Math.ceil(data.length / 3);
    for (let i = 0; i < parts; i++) {
      if (i === 3) {
        cpf += `-${data.substr(i * 3)}`;
        break;
      }
      cpf += `${i !== 0 ? "." : ""}${data.substr(i * 3, 3)}`;
    }
    // Pass formatting for the data
    data = cpf;
    // Update state
    return data;
  };

  const handleClickAddStatement = () => {
    setStatement([...statement, { ...emptyStatement }])
  };

  const handleClickRemoveStatement = (i) => {
    const a = [...statement].splice(i)
    setStatement(a)
  };

  const handleSubmit = async (values, actions) => {
    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync();

      actions.setSubmitting(false)
      await Fetcher.post(`${props.API_URL_BROWSER}api/register`, { recaptchaToken, values }, { setErrorMessage })
      setAttendeeEmail(values.attendeeEmail)
      setCreated(true)
    } catch (e) {
      setErrorMessage(e)
    }
    try {
      await recaptchaRef.current.reset();
    } catch (e) { }
  };

  const onChange = () => {

  }

  function selectCommittee(committee_id, setFieldValue){
    setFieldValue(`statement.${editingCommittee}.committeeId`, committee_id)
    setEdittingCommittee(null)
  }

  function renderCommittee(id){
    if(id === undefined)
      return  <div>[Selecione]</div>;

    const committee = props.forumConstants.committee[id]
    
    return <div className='p-1'>
      <h6>{committee.name}</h6>
      <div style={{paddingLeft: "20px"}}>{committee.description}</div>
    </div>
  }

  return (
    <Layout forumName={props.forumConstants.forumName} errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <h1 className='mb-4'>Formulário de inscrições de propostas de enunciados</h1>

      {created
        ? <p className='alert alert-success'>Sua(s) proposta(s) de enunciado(s) foi/foram recebida(s) com sucesso. Consulte o email "{attendeeEmail}" para ver a confirmação.</p>
        : <>
          <p>
            Solicite sua inscrição e sugira um, dois ou três enunciados para serem debatidos. Para mais informações, visite o <a href="https://www10.trf2.jus.br/institucional/forum-de-direitos-humanos-e-fundamentais/" target='_blank' rel="noopener">Portal do Fórum de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região</a> e leia o <a href="#regimento" onClick={()=> regimentoRef.current.show()}>Regimento da Jornada</a>.
          </p>

          <Formik
            validateOnBlur={false}
            validationSchema={registerSchema}
            onSubmit={(values, actions) => { handleSubmit(values, actions) }}
            initialValues={{
              privacyPolice: false,
              regimento: false,
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
              statement: [{
                text: '',
                justification: '',
                committeeId: undefined
              }]
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors, isSubmitting, setFieldValue  }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col col-12 col-lg-6">
                    <Form.Group className="mb-3" controlId="attendeeName">
                      <Form.Label>Nome Completo</Form.Label>
                      <Form.Control type="text" value={values.attendeeName} onChange={handleChange} isValid={touched.attendeeName && !errors.attendeeName} isInvalid={touched.attendeeName && errors.attendeeName} />
                      <Form.Control.Feedback type="invalid">{errors.attendeeName}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col col-12 col-lg-6">
                    <Form.Group className="mb-3" controlId="attendeeChosenName">
                      <Form.Label>Nome Social (opcional)</Form.Label>
                      <Form.Control type="text" value={values.attendeeChosenName} onChange={handleChange} isValid={touched.attendeeChosenName && !errors.attendeeChosenName} isInvalid={touched.attendeeChosenName && errors.attendeeChosenName} />
                      <Form.Control.Feedback type="invalid">{errors.attendeeChosenName}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col col-12 col-lg-3">
                    <Form.Group className="mb-3" controlId="attendeeEmail">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control type="email" value={values.attendeeEmail} onChange={handleChange} isValid={touched.attendeeEmail && !errors.attendeeEmail} isInvalid={touched.attendeeEmail && errors.attendeeEmail} />
                      <Form.Control.Feedback type="invalid">{errors.attendeeEmail}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col col-12 col-lg-3">
                    <Form.Group className="mb-3" controlId="attendeeEmailConfirmation">
                      <Form.Label>Confirmação de E-mail</Form.Label>
                      <Form.Control type="email" value={values.attendeeEmailConfirmation} onChange={handleChange} isValid={touched.attendeeEmailConfirmation && !errors.attendeeEmailConfirmation} isInvalid={touched.attendeeEmailConfirmation && errors.attendeeEmailConfirmation} />
                      <Form.Control.Feedback type="invalid">{errors.attendeeEmailConfirmation}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col col-12 col-lg-3">
                    <Form.Group className="mb-3" controlId="attendeePhone">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control type="text" value={values.attendeePhone} onChange={(evt) => { evt.target.value = handleChangeAttendeePhone(evt.target.value); handleChange(evt) }} isValid={touched.attendeePhone && !errors.attendeePhone} isInvalid={touched.attendeePhone && errors.attendeePhone} />
                      <Form.Control.Feedback type="invalid">{errors.attendeePhone}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col col-12 col-lg-3 d-none">
                    <Form.Group className="mb-3" controlId="attendeeDocument">
                      <Form.Label>CPF</Form.Label>
                      <Form.Control type="text" value={values.attendeeDocument} onChange={(evt) => { evt.target.value = handleChangeAttendeeDocument(evt.target.value); handleChange(evt) }} isValid={touched.attendeeDocument && !errors.attendeeDocument} isInvalid={touched.attendeeDocument && errors.attendeeDocument} />
                      <Form.Control.Feedback type="invalid">{errors.attendeeDocument}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col col-12 col-lg-3">
                    <Form.Group className="mb-3" controlId="attendeeOccupationId">
                      <Form.Label>Profissão</Form.Label>
                      <Form.Control as="select" value={values.attendeeOccupationId} onChange={handleChange} isValid={touched.attendeeOccupationId && !errors.attendeeOccupationId} isInvalid={touched.attendeeOccupationId && errors.attendeeOccupationId} >
                        <option value hidden={values.attendeeOccupationId}>[Selecione]</option>
                        {Object.keys(props.forumConstants.occupation).map((ci) => (<option key={ci} value={ci}>{props.forumConstants.occupation[ci].name}</option>))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">{errors.attendeeOccupationId}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col col-12 col-lg-6">
                    <Form.Group className="mb-3" controlId="attendeeAffiliation">
                      <Form.Label>Vinculado a qual Órgão (se for o caso)</Form.Label>
                      <Form.Control type="text" value={values.attendeeAffiliation} onChange={(evt) => { handleChange(evt) }} isValid={touched.attendeeOccupationId && !errors.attendeeAffiliation} isInvalid={touched.attendeeOccupationId && errors.attendeeAffiliation} />
                      <Form.Control.Feedback type="invalid">{errors.attendeeAffiliation}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  {false && values.attendeeOccupationId === '6' ?
                    (<div className="col col-12 col-lg-6">
                      <Form.Group className="mb-3" controlId="attendeeOccupationOther">
                        <Form.Label>Descrever a Categoria</Form.Label>
                        <Form.Control type="text" value={values.attendeeOccupationOther} onChange={handleChange} isValid={touched.attendeeOccupationId && !errors.attendeeOccupationOther} isInvalid={touched.attendeeOccupationId && errors.attendeeOccupationOther} />
                        <Form.Control.Feedback type="invalid">{errors.attendeeOccupationOther}</Form.Control.Feedback>
                      </Form.Group>
                    </div>) : <></>
                  }

                  <div className="col col-12 col-lg-3">
                    <Form.Group className="mb-3" controlId="attendeeDisabilityYN">
                      <Form.Label>Pessoa com Deficiência</Form.Label>
                      <Form.Control as="select" value={values.attendeeDisabilityYN} onChange={(evt) => { evt.target.value = !!(evt.target.value === 'true' || evt.target.value === true); handleChange(evt) }} isValid={touched.attendeeDisabilityYN && !errors.attendeeDisabilityYN} isInvalid={touched.attendeeDisabilityYN && errors.attendeeDisabilityYN} >
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
                        <Form.Control type="text" value={values.attendeeDisability} onChange={handleChange} isValid={touched.attendeeDisability && !errors.attendeeDisability} isInvalid={touched.attendeeDisability && errors.attendeeDisability} />
                        <Form.Control.Feedback type="invalid">{errors.attendeeDisability}</Form.Control.Feedback>
                      </Form.Group>
                    </div>) : <></>
                  }
                </div>

                <FieldArray name="statement">
                  {({ insert, remove, push, pop }) => (
                    <div>
                      {values.statement.length > 0 && values.statement.map((s, i) =>
                      (
                        <div className="row" key={i}>
                          <div className="col col-12">
                            <h3>
                              Enunciado {values.statement.length > 1 ? i + 1 : ''}
                              
                              {i > 0 && i == (values.statement.length - 1) ?
                              <Button variant="secondary" onClick={() => pop()} className="ml-3 btn btn-sm" style={{ marginRight: '1em', marginLeft: '1em' }}>
                                Remover
                              </Button>
                              : <></>}
                            </h3>

                           

                          </div>

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
                                {Object.keys(props.forumConstants.committee).map((ci) => (<option key={ci} value={ci}>{props.forumConstants.committee[ci].name}</option>))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">{errors && errors.statement && errors.statement[i] && errors.statement[i].committeeId}</Form.Control.Feedback>
                            </Form.Group>
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


                          <div className="col text-center">
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

                        </div>
                      )

                      )}
                    </div>
                  )}
                </FieldArray>

                <Modal show={editingCommittee != null} size='xl' scrollable onHide={()=> setEdittingCommittee(null)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Comissões</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className='form-control p-0 custom-select-container'>
                    {
                      Object.keys(props.forumConstants.committee).map( (committee_id) => (
                            <div key={committee_id} className='p-3 custom-option' onClick={() => selectCommittee(committee_id, setFieldValue)}>
                              <h6>{props.forumConstants.committee[committee_id].name}</h6>
                              <div style={{paddingLeft: "20px"}}>{props.forumConstants.committee[committee_id].description}</div>
                            </div>
                          ))}
                  </Modal.Body>
                </Modal>
                <div className="row" style={{ marginBottom: '6em' }}>
                  <div className="col">
                  <Form.Check>
                      <Form.Check.Input 
                        checked={values.privacyPolice} 
                        type="checkbox" 
                        isInvalid={touched.privacyPolice && errors.privacyPolice}
                        onChange={e => setFieldValue('privacyPolice', e.target.checked)}
                      />
                      <Form.Check.Label id="privacyPolicy">
                        Declaro que li e concordo com os <a role='button' href='#privacyPolicy' onClick={() => privacyPolicyRef.current.show()}>Termos de Uso</a> e a <a role='button' href='#privacyPolicy' onClick={() => privacyPolicyRef.current.show()}>Política de Privacidade</a>
                      </Form.Check.Label>
                      <Form.Control.Feedback type="invalid">{errors.privacyPolice != undefined}</Form.Control.Feedback>
                    </Form.Check>


                    <Form.Check>
                      <Form.Check.Input 
                        checked={values.regimento} 
                        type="checkbox" 
                        isInvalid={touched.regimento && errors.regimento}
                        onChange={e => setFieldValue('regimento', e.target.checked)}
                      />
                      <Form.Check.Label id="regimento">
                        Declaro que li e concordo com o <a role='button' href='#privacyPolicy' onClick={() => regimentoRef.current.show()}>Regimento da Jornada</a>
                      </Form.Check.Label>
                      <Form.Control.Feedback type="invalid">{errors.regimento != undefined}</Form.Control.Feedback>
                    </Form.Check>
                    
                  </div>
                  <div className="col col-auto d-flex align-items-center">
                    <Button type="submit" variant="primary" className="ml-auto" disabled={false}>
                      Enviar
                    </Button>
                  </div>
                </div>
                <ReCAPTCHA className="mt-5" ref={recaptchaRef} size="invisible" sitekey="6LdaLcQnAAAAAEMD67TvgcCck_qWMkXQefETSt2B" onChange={onChange} />
                <p className="text-muted d-none">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
              </Form>
            )}</Formik>
        </>
      }
      <PrivacyPolicy ref={privacyPolicyRef}/>
      <Regimento ref={regimentoRef} />
    </Layout >
  )
}