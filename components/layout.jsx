import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBuildingColumns } from '@fortawesome/free-solid-svg-icons'
import { usarContexto } from '../contexto';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const siteTitle = 'Jornada';

export default function Layout({ children }) {
    const {usuario, forum} = usarContexto();
    const [exibirMenu, setExibirMenu] = useState(false);


    function logout(){
        fetch('/api/login', {method: 'DELETE'}).then(res => {
            if(!res.ok)
                throw 'err';

            window.location.href = '/assessoria/login';
        })
    }

    const {administrar_comissoes, estatistica, crud} = usuario?.permissoes || {};

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
                        <div className='col-12'>
                            <span className="text-success font-weight-bold" style={{ fontSize: "150%" }}><FontAwesomeIcon icon={faBuildingColumns} /></span>&nbsp;&nbsp;
                            <strong>{forum?.forum_name}</strong>
                        </div>
                        {usuario &&
                            <div className='col d-flex align-items-center justify-content-end' style={{fontSize: 14, textAlign: 'right'}}>
                                <FontAwesomeIcon onClick={()=> setExibirMenu(!exibirMenu)} style={{fontSize: 26}} icon={faBars} />
                            </div>
                        }
                    </div>
                </div>
            </div>
            {usuario &&
                <Dropdown className='container' show={exibirMenu} onToggle={()=> setExibirMenu(!exibirMenu)}>
                    <Dropdown.Menu style={{ marginTop: -20, right: 0}} id='menu'>
                        <div style={{margin: 20}}>
                            <div>{usuario.nome}</div>
                            <div>{usuario.lotacao}</div>
                        </div>
                        {crud && <>
                            <Dropdown.Divider />
                            <Dropdown.Item href="/admin/comite">* Comissões</Dropdown.Item>
                            <Dropdown.Item href="/admin/enunciado">* Enunciados</Dropdown.Item>
                            <Dropdown.Item href="/admin/forum">* Fóruns</Dropdown.Item>
                            <Dropdown.Item href="/admin/participante">* Participantes</Dropdown.Item>
                            <Dropdown.Item href="/admin/ocupacao">* Ocupações</Dropdown.Item>
                            <Dropdown.Item href="/admin/permissao">* Permissões</Dropdown.Item>
                        </>}

                        {(administrar_comissoes.length !== 0 || estatistica) &&
                            <Dropdown.Divider />
                        }
                        
                        {administrar_comissoes.length !== 0 && <Dropdown.Item href="/admissao">Admissão</Dropdown.Item>}

                        {(administrar_comissoes.length !== 0 || estatistica) && <>
                            <Dropdown.Item href="/inscricoes">Inscrições</Dropdown.Item>
                            <Dropdown.Item href="/membros">Membros</Dropdown.Item>
                        </>}


                        {/*<Dropdown.Divider />
                        <Dropdown.Item href="/ajuda">Ajuda</Dropdown.Item>*/}

                        <Dropdown.Divider />
                        <Dropdown.Item onClick={logout}>Sair</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
        </header>

        <div className="container mb-3">
            {children}
        </div>
    </>
    );
}