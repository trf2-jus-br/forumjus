import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react'
import Fetcher from '../utils/fetcher'
import Layout from '../components/layout'
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaRef = React.createRef();

export async function getServerSideProps({ params }) {
  return {
    props: {
      API_URL_BROWSER: process.env.API_URL_BROWSER
    },
  };
}

export default function Create(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [attendeeName, setAttendeeName] = useState(undefined)
  const [attendeeEmail, setAttendeeEmail] = useState(undefined)
  const [attendeePhone, setAttendeePhone] = useState(undefined)
  const [attendeeDisabilityYN, setAttendeeDisabilityYN] = useState(false)
  const [attendeeDisability, setAttendeeDisability] = useState(undefined)
  const [attendeeDocument, setAttendeeDocument] = useState(undefined)
  const [attendeeCategory, setAttendeeCategory] = useState(undefined)
  const emptyStatement = {
    title: '',
    text: '',
    justification: '',
    committee: undefined
  }
  const [statement, setStatement] = useState([{ ...emptyStatement }])

  const [statementTitle, setStatementTitle] = useState(undefined)
  const [statementText, setStatementText] = useState(undefined)
  const [statementJustification, setStatementJustification] = useState(undefined)
  const [statementCommittee, setStatementCommittee] = useState(undefined)

  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)
  const [validated, setValidated] = useState(false);

  // Load fields from localStorage
  React.useEffect(() => {
  }, [])

  const handleChangeAttendeeName = (evt) => { setAttendeeName(evt.target.value) };
  const handleChangeAttendeeEmail = (evt) => { setAttendeeEmail(evt.target.value) };

  const handleChangeAttendeePhone = (evt) => {
    let data = event.target.value.replace(/\D/g, "");
    if (data.length > 11) data = data.substr(0, 11)
    data = data.replace(/\D/g, '')
    data = data.replace(/(\d{2})(\d)/, "($1) $2")
    data = data.replace(/(\d)(\d{4})$/, "$1-$2")
    setAttendeePhone(data)
  };
  const handleChangeAttendeeDisabilityYN = (evt) => { setAttendeeDisabilityYN(evt.target.value === 'true'); if (!attendeeDisabilityYN) setAttendeeDisability(undefined) };
  const handleChangeAttendeeDisability = (evt) => { setAttendeeDisability(evt.target.value) };
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
    setAttendeeDocument(data);
  };
  const handleChangeAttendeeCategory = (evt) => { setAttendeeCategory(evt.target.value) };
  const handleChangeStatementTitle = (evt, i) => { setStatementTitle(evt.target.value, i) };
  const handleChangeStatementText = (evt, i) => { setStatement(statement.map((s, idx) => (i === idx) ? { ...s, text: evt.target.value } : { ...s })) };
  const handleChangeStatementJustification = (evt, i) => { setStatement(statement.map((s, idx) => (i === idx) ? { ...s, justification: evt.target.value } : { ...s })) };
  const handleChangeStatementCommittee = (evt, i) => { setStatement(statement.map((s, idx) => (i === idx) ? { ...s, committee: evt.target.value } : { ...s })) };

  const handleClickAddStatement = () => {
    setStatement([...statement, { ...emptyStatement }])
  };

  const handleClickRemoveStatement = (i) => {
    const a = [...statement].splice(i)
    setStatement(a)
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    console.log('register')
    setCreating(true)
    const recaptchaToken = await recaptchaRef.current.executeAsync();
    try {
      await Fetcher.post(`${props.API_URL_BROWSER}api/register`, { recaptchaToken, attendeeName, attendeeEmail, attendeeDocument, attendeeCategory }, { setErrorMessage })
      setCreated(true)
    } catch (e) { }
    setCreating(false)
  };

  const onChange = () => {

  }

  const statementForm = (s, i) => {
    return (
      <div className="row" key={i}>
        <div className="col col-12">
          <h3>Enunciado {statement.length > 1 ? i + 1 : ''}</h3>
        </div>

        <div className="col col-12 col-lg-6">
          <Form.Group className="mb-3" controlId="statementCommittee">
            <Form.Label>Comissão</Form.Label>
            <Form.Control as="select" type="email" value={statement[i].committee} onChange={(evt) => handleChangeStatementCommittee(evt, i)} required >
              <option value disabled selected hidden>[Selecione]</option>
              <option value="1">Assuntos Fundiários</option>
              <option value="2">Enfrentamento ao Assédio Moral e Sexual</option>
              <option value="3">Saúde</option>
            </Form.Control>
          </Form.Group>
        </div>

        {i > 0 ? <div className="col align-self-end">
          <Button variant="secondary" onClick={() => handleClickRemoveStatement(1)} className="mb-3">
            Remover Enunciado {i + 1}
          </Button>
        </div> : <></>}


        <div className="w-100 d-none d-md-block"></div>
        <div className="col col-12 col-md-6">
          <Form.Group className="mb-3" controlId="statementText">
            <Form.Label>Enunciado</Form.Label>
            <Form.Control as="textarea" rows="10" value={statement[i].text} onChange={(evt) => handleChangeStatementText(evt, i)} required maxlength="800" />
            <Form.Text className="text-muted">
              Escreva um texto de no máximo 800 caracteres.
            </Form.Text>
          </Form.Group>
        </div>
        <div className="col col-12 col-md-6">
          <Form.Group className="mb-3" controlId="statementJustification">
            <Form.Label>Justificativa</Form.Label>
            <Form.Control as="textarea" rows="10" value={statement[i].justification} onChange={(evt) => handleChangeStatementJustification(evt, i)} required maxlength="1600" />
            <Form.Text className="text-muted">
              Escreva uma justificativa para o enunciado de no máximo 1600 caracteres.
            </Form.Text>
          </Form.Group>
        </div>
      </div>)
  }

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <h1 className='mb-4'>Inscrição</h1>

      {created
        ? <p className='alert alert-success'>Inscrição realizada com sucesso. Consulte o email "{attendeeEmail}" para ver a confirmação.</p>
        : <>
          <p>
            Faça sua incrição e sugira um ou mais enunciados para serem debatidos.
          </p>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="attendeeName">
                  <Form.Label>Nome Social</Form.Label>
                  <Form.Control type="text" value={attendeeName} onChange={handleChangeAttendeeName} required
                    feedback="O nome deve ser informado."
                    feedbackType="invalid" />
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-3">
                <Form.Group className="mb-3" controlId="attendeeCategory">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control as="select" value={attendeeCategory} onChange={handleChangeAttendeeCategory} required >
                    <option value disabled selected hidden>[Selecione]</option>
                    <option value="1">Jurista</option>
                    <option value="2">Especialista</option>
                    <option value="3">Magistrado</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-3">
                <Form.Group className="mb-3" controlId="attendeeEmail">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" value={attendeeEmail} onChange={handleChangeAttendeeEmail} required />
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-3">
                <Form.Group className="mb-3" controlId="attendeePhone">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" value={attendeePhone} onChange={handleChangeAttendeePhone} required />
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-3">
                <Form.Group className="mb-3" controlId="attendeeDocument">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control type="text" value={attendeeDocument} onChange={handleChangeAttendeeDocument} required />
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-3">
                <Form.Group className="mb-3" controlId="attendeeDisabilityYN">
                  <Form.Label>Pessoa com Deficiência</Form.Label>
                  <Form.Control as="select" value={attendeeDisabilityYN} onChange={handleChangeAttendeeDisabilityYN} >
                    <option value={false}>Não</option>
                    <option value={true}>Sim</option>
                  </Form.Control>
                </Form.Group>
              </div>
              {attendeeDisabilityYN ?
                (<div className="col col-12 col-lg-3">
                  <Form.Group className="mb-3" controlId="attendeeDisability">
                    <Form.Label>Descrever o Tipo de Deficiência</Form.Label>
                    <Form.Control type="text" value={attendeeDisability} onChange={handleChangeAttendeeDisability} required />
                  </Form.Group>
                </div>) : <></>
              }
            </div>

            {statement.map((s, i) => statementForm(s, i))}

            <div className="row" style={{ marginBottom: '6em' }}>
              <div className="col">
                <Button variant="info" disabled={statement.length > 2} onClick={handleClickAddStatement}>
                  Adicionar Enunciado
                </Button>
              </div>
              <div className="col col-auto">
                <Button type="submit" variant="primary" className="ml-auto" disabledxxx={!attendeeName || !attendeeEmail || !attendeeDocument || !attendeeCategory || !statement || statement.find(s => !s.text || !s.justification || !s.committee)}>
                  Enviar
                </Button>
              </div>
            </div>
            <ReCAPTCHA className="mt-5" ref={recaptchaRef} size="invisible" sitekey="6LdaLcQnAAAAAEMD67TvgcCck_qWMkXQefETSt2B" onChange={onChange} />
            <p className="text-muted d-none">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
          </Form>
        </>
      }
    </Layout >
  )
}