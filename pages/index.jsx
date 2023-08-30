import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  return (
    <div className="container content">
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="text-success font-weight-bold" style={{ fontSize: "400%" }}><FontAwesomeIcon icon={faBuildingColumns} /></h1>
        <h1 className="display-5 fw-bold">Fórumjus</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">Fórumjus é um sistema desenvolvido para receber incrições e enunciados para o I Fórum de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região.</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a className="btn btn-primary btn-lg px-4" href="register" style={{ "color": "white" }}>Inscrição</a>
          </div>
        </div>
      </div>
    </div>
  )
}