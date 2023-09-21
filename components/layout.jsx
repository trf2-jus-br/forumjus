import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons'
import ModalError from './modalError'
import { Permissao, usuario } from '../context/usuario';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export const siteTitle = 'Jornada';

export default function Layout({ children, forumName, errorMessage, setErrorMessage }) {
    const usuario_logado = usuario();

    return (<>
        <Head>
            <link rel="icon" href="/favicon-32x32.png" />
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
            <title>{siteTitle}</title>
        </Head>
        <header>
            <div className="navbar navbar-dark bg-dark shadow-sm mb-4">
                <div className="container">
                    <div className="navbar-brand d-flex align-items-center" style={{whiteSpace: 'normal'}}>
                        <span className="text-success font-weight-bold" style={{ fontSize: "150%" }}><FontAwesomeIcon icon={faBuildingColumns} /></span>&nbsp;&nbsp;
                        <strong>{forumName}</strong>
                    </div>
                    <div>
                        {
                            usuario_logado?.permissoes?.crud && <DropdownButton title="CRUD">
                                <Dropdown.Item href="/admin/ocupacao" >Ocupações</Dropdown.Item>
                                <Dropdown.Item href="/admin/enunciado" >Enunciados</Dropdown.Item>
                                <Dropdown.Item href="/admin/comite" >Comitês</Dropdown.Item>
                                <Dropdown.Item href="/admin/participante" >Participantes</Dropdown.Item>
                                <Dropdown.Item href="/admin/forum" >Fóruns</Dropdown.Item>
                                <Dropdown.Item href="/admin/permissao" >Permissões</Dropdown.Item>
                            </DropdownButton>
                        }
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