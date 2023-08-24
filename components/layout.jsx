import Head from 'next/head';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons'
import ModalError from './modalError'

export const siteTitle = 'FórumJus';

export default function Layout({ children, errorMessage, setErrorMessage }) {
    return (<>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
                name="description"
                content="Learn how to build a personal website using Next.js"
            />
            <meta
                property="og:image"
                content={`https://og-image.vercel.app/${encodeURI(
                    siteTitle,
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large_image" />
            <title>Fórumjus</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
            <div className="navbar navbar-dark bg-dark shadow-sm mb-4">
                <div className="container">
                    <div className="navbar-brand d-flex align-items-center" style={{whiteSpace: 'normal'}}>
                        <span className="text-success font-weight-bold" style={{ fontSize: "150%" }}><FontAwesomeIcon icon={faBuildingColumns} /></span>&nbsp;&nbsp;
                        <strong>I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da Segunda Região</strong>
                    </div>
                </div>
            </div>
        </header>

        <div className="container mb-3">
            {children}
        </div>
        <ModalError show={errorMessage} onOk={() => setErrorMessage(undefined)} onCancel={() => setErrorMessage(undefined)} title="Atenção" text={errorMessage} />
    </>
    );
}