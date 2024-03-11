import React from "react";
import { Spinner } from "react-bootstrap";

function Carregamento(){
    return  <div className='d-flex justify-content-center align-items-center' style={{flex: 1}}>
        <Spinner style={{color: "#0003"}} />
    </div>
}

export default Carregamento;