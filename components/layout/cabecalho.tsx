import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBuildingColumns, faSkull } from '@fortawesome/free-solid-svg-icons'
import { usarContexto } from '../../contexto';
import { Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { retornoAPI } from '../../utils/api-retorno';

export const siteTitle = 'Jornada';

type Props = React.PropsWithChildren & {
    fluid?: boolean; 
}

function Cabecalho({fluid} : Props){
    const {usuario, forum} = usarContexto();
    const [exibirMenu, setExibirMenu] = useState(false);
    const {api, exibirNotificacao} = usarContexto();

    const container = fluid ? 'container-fluid px-5' : 'container';

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
    
    function Se(...funcoes: FuncaoMembro[]){
        if(!usuario)
            return false;

        return funcoes.indexOf(usuario.funcao) !== -1;
    }

    return <header>
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
}

export default Cabecalho;