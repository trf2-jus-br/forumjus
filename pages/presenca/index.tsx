import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { usarContexto } from '../../contexto';
import Layout from '../../components/layout';
import { Button, Table } from 'react-bootstrap';
import { retornoAPI } from '../../utils/api-retorno';

function Presenca() {
    const [membros, setMembros] = useState<Membro[]>([]);
    const [comites, setComites] = useState<Comite[]>([]);
    const [presentes, setPresentes] = useState<Membro[]>([]);
    const [filtro, setFiltro] = useState<Comite>(null);

    const {api, exibirNotificacao} = usarContexto();

    async function carregarMembros(){
        try{
            const {data} = await api.get<Membro[]>('api/membro');
            setMembros(data);
        }catch(err){
            exibirNotificacao({ titulo: 'Erro ao carregar membros', tipo: 'ERRO', texto: retornoAPI(err)});   
        }
    }

    async function carregarComites(){
        try{
            const {data} = await api.get<Comite[]>('api/comite');
            setComites(data);
        }catch(err){
            exibirNotificacao({ titulo: 'Erro ao carregar membros', tipo: 'ERRO', texto: retornoAPI(err)});   
        }
    }

    async function carregarListaPresentes(){
        try{
            const {data} = await api.get<Membro[]>('api/presenca');
            setPresentes(data);
        }catch(err){
            exibirNotificacao({ titulo: 'Erro ao carregar presentes', tipo: 'ERRO', texto: retornoAPI(err)});   
        }
    }

    async function marcarEntrada(membro: Membro){
        if(membro == null)
            return;

        try{
            await api.post('api/presenca', {id: membro.id});
            carregarListaPresentes();
        }catch(err){
            exibirNotificacao({ titulo: 'Erro ao registrar presença.', tipo: 'ERRO', texto: retornoAPI(err)});   
        }
    }
    
    async function marcarSaida(membro: Membro){
        try{
            await api.delete(`api/presenca?id=${membro.id}`);
            carregarListaPresentes();
        }catch(err){
            exibirNotificacao({ titulo: 'Erro ao registrar saída.', tipo: 'ERRO', texto: retornoAPI(err)});   
        }
    }

    useEffect(()=>{
        carregarMembros();
        carregarComites();
        carregarListaPresentes();
    }, [])

    const listaPresentesFiltrada = !filtro ? presentes : presentes.filter(({comite}) => comite == filtro.committee_id)
    const listaMembrosFiltrada = !filtro ? membros : membros.filter(d => d.comite == filtro.committee_id)

    return (
        <Layout>
            <h5 className='col-5'>Presença</h5>

            <div className='d-flex row flex-row-reverse' style={{gridGap: '10px 0px'}}>
                <Autocomplete
                    className='col-12 col-lg-3'
                    disablePortal
                    value={!filtro?  null : {...filtro, label: `${ filtro?.committee_id}. ${filtro?.committee_name}`}}
                    onChange={(event, comite) => setFiltro(comite)}
                    id="combo-box-demo"
                    options={comites.map(m => ({...m, label: `${ m.committee_id}. ${m.committee_name}`}))}
                    renderInput={(params) => <TextField {...params} label="Comitê" />}
                />
                
                <Autocomplete
                    className='col-12 col-lg-9'
                    disablePortal
                    id="combo-box-demo"
                    options={listaMembrosFiltrada.map(m => ({...m, key: m.id, label: m.nome.toUpperCase()}))}
                    renderInput={(params) => <TextField {...params} label="Membro" />}
                    onChange={(event, value)=> marcarEntrada(value)}
                />
            </div>

            <h5 className='mt-5'>Membros</h5>
            <Table striped>
                <thead>
                    <tr>
                    </tr>
                </thead>
                <tbody>
                    {listaPresentesFiltrada.length === 0 && (
                        <tr className='m-3'>
                            <td>Nenhuma presença registrada.</td>
                        </tr>
                    )}
                    {listaPresentesFiltrada.map(p =>(
                        <tr key={p.id}>
                            <td >{p.nome.toUpperCase()}</td>
                            <td className='text-end'>
                                <Button size='sm' onClick={() => marcarSaida(p)}>Sair</Button>
                            </td>
                        </tr> 
                    ))}
                </tbody>
            </Table>

        </Layout>
    );
}

export default Presenca;