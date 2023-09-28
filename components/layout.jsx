import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons'
import { usarContexto } from '../contexto';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

export const siteTitle = 'Jornada';

export default function Layout({ children }) {
    const {usuario, forum} = usarContexto();

    function logout(){
        fetch('/api/login', {method: 'DELETE'}).then(res => {
            if(!res.ok)
                throw 'err';

            window.location.href = '/login';
        })
    }

    console.log(usuario);

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
                    <div className="navbar-brand w-100 d-flex align-items-center justify-content-between" style={{whiteSpace: 'normal'}}>
                        <div className='col-8'>
                            <span className="text-success font-weight-bold" style={{ fontSize: "150%" }}><FontAwesomeIcon icon={faBuildingColumns} /></span>&nbsp;&nbsp;
                            <strong>{forum?.forum_name}</strong>
                        </div>
                        {usuario &&
                            <div className='col-4 d-flex align-items-center justify-content-end' style={{fontSize: 14, textAlign: 'right'}}>
                                <div style={{marginRight: 10}}>
                                    <div>{usuario.nome}</div>
                                    <div>{usuario.lotacao}</div>
                                </div>
                                <Button size="sm" onClick={logout} title='Sair'>Sair</Button>
                            </div>
                        }
                        </div>
                    <div>
                        {
                            usuario?.permissoes?.crud && <DropdownButton title="CRUD">
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
    </>
    );
}