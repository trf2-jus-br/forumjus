import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBuildingColumns, faSkull } from '@fortawesome/free-solid-svg-icons'
import { usarContexto } from '../contexto';
import { Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { retornoAPI } from '../utils/api-retorno';

export const siteTitle = 'Jornada';

type Props = React.PropsWithChildren & {
    fluid?: boolean; 
}

export default function Layout({ children, fluid } : Props) {
    const {usuario, forum} = usarContexto();
    const [exibirMenu, setExibirMenu] = useState(false);
    const {api, exibirNotificacao} = usarContexto();

    function logout(){
        api.delete('/api/login')
        .then(() => {
            window.location.href = '/assessoria/login';
        }).catch(err => {
            // Não faz nada, só notifica o usuário.
            // Efeito do Erro: O usuário permanecerá na tela em que está, sem deslogar.
            exibirNotificacao({
                titulo: 'Não foi possível deslogar.',
                texto: retornoAPI(err),
                tipo: 'ERRO'
            })
        })
    }

    const container = fluid ? 'container-fluid px-5' : 'container';

    function Se(...funcoes: FuncaoMembro[]){
        if(!usuario)
            return false;

        return funcoes.indexOf(usuario.funcao) !== -1;
    }

    return (<div className='d-flex flex-column' style={{minHeight: '100vh'}}>
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
                <div className={`${container}`}>
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
                <Dropdown className={`${container}`} show={exibirMenu} onToggle={()=> setExibirMenu(!exibirMenu)}>
                    <Dropdown.Menu style={{ marginTop: -20, right: 0}} id='menu'>
                        <div style={{margin: 20}}>
                            <div>{usuario.nome}</div>
                            <div>{usuario.lotacao || usuario.funcao}</div>
                        </div>
                        <Dropdown.Divider />
                        {Se("PROGRAMADOR") && <>
                            <Dropdown.Header>
                                <h6 style={{color: '#a00'}}>admin</h6>
                            
                                <Dropdown.Item href="/admin/db" style={{color: '#a00'}}>
                                    <FontAwesomeIcon style={{marginRight: 10}} icon={faSkull} />DB<FontAwesomeIcon style={{marginLeft: 10}} icon={faSkull} />
                                </Dropdown.Item>
                                <Dropdown.Item href="/admin/comite" style={{color: '#a00'}}>Comissões</Dropdown.Item>
                                <Dropdown.Item href="/admin/enunciado"  style={{color: '#a00'}}>Enunciados</Dropdown.Item>
                                <Dropdown.Item href="/admin/forum"  style={{color: '#a00'}}>Fóruns</Dropdown.Item>
                                <Dropdown.Item href="/admin/participante"  style={{color: '#a00'}}>Participantes</Dropdown.Item>
                                <Dropdown.Item href="/admin/ocupacao"  style={{color: '#a00'}}>Ocupações</Dropdown.Item>
                            </Dropdown.Header>
                            <Dropdown.Divider />
                        </>}
                        
                        {Se("PRESIDENTE", "PRESIDENTA", "RELATOR", "RELATORA") && <Dropdown.Item href="/admissao">Admissão</Dropdown.Item>}

                        {!Se("MEMBRO") && <Dropdown.Item href="/caderno">Cadernos</Dropdown.Item>}
                        {!Se("MEMBRO") && <Dropdown.Item href="/inscricoes">Inscrições</Dropdown.Item>}
                        {Se("ASSESSORIA", "PROGRAMADOR") && <Dropdown.Item href="/membros">Membros</Dropdown.Item>}
                        {Se("ASSESSORIA", "PROGRAMADOR") && <Dropdown.Item href="/notificar-participacao">Notificar Participantes</Dropdown.Item>}
                        
                        {Se("PRESIDENTE", "PRESIDENTA", "RELATOR", "RELATORA") && <Dropdown.Item href="/telao">Telão</Dropdown.Item>}
                        {Se("PRESIDENTE", "PRESIDENTA", "RELATOR", "RELATORA") && <Dropdown.Item href="/controle-votacao">Telão - Controle</Dropdown.Item>}

                        {!Se("ASSESSORIA", "PROGRAMADOR") && <Dropdown.Item href="/votacao">Votação</Dropdown.Item>}


                        {/*<Dropdown.Divider />
                        <Dropdown.Item href="/ajuda">Ajuda</Dropdown.Item>*/}

                        <Dropdown.Divider />
                        <Dropdown.Item onClick={logout}>Sair</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
        </header>

        <div className={`${container} mb-3 d-flex flex-column`} style={{flex: 1}}>
            {children}
        </div>
    </div>
    );
}