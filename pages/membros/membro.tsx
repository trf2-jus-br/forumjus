import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "../../components/tooltip";
import { faKey } from "@fortawesome/free-solid-svg-icons";

interface Props {
    funcao: string;
    membros : Membro[];
    setMembroSelecionado: React.Dispatch<React.SetStateAction<Membro>>
}

function Membro({membros, funcao, setMembroSelecionado}: Props){
    if(!membros)
        return <></>

    return  <div className="col-lg-12 col-12 mt-5">
        {membros.map(membro => <React.Fragment key={membro.nome}>
                <h6>
                {membro.nome}
                <Tooltip mensagem="Código de acesso" posicao="top">
                    <FontAwesomeIcon onClick={()=> setMembroSelecionado(membro)} style={{marginLeft: 10, cursor: "pointer"}} icon={faKey}/>
                </Tooltip>
            </h6>
            
        </React.Fragment>)}
        <div style={{textTransform:"capitalize"}}>{funcao.toLowerCase()}</div>
    </div>     
}


export default Membro;