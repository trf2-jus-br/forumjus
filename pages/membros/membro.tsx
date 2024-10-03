import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "../../components/tooltip";
import { faKey } from "@fortawesome/free-solid-svg-icons";

interface Props {
    membros : Membro[];
    setMembroSelecionado: React.Dispatch<React.SetStateAction<Membro>>
}

function Membro({membros, setMembroSelecionado}: Props){
    if(!membros)
        return <></>

    return  <div className="col-lg-12 col-12 mt-5">
        {membros.map(membro => <>
                <h6>
                {membro.nome}
                <Tooltip mensagem="Código de acesso" posicao="top">
                    <FontAwesomeIcon onClick={()=> setMembroSelecionado(membro)} style={{marginLeft: 10, cursor: "pointer"}} icon={faKey}/>
                </Tooltip>
            </h6>
            
        </>)}
        <div style={{textTransform:"capitalize"}}>{membros[0].funcao.toLowerCase()}</div>
    </div>     
}


export default Membro;