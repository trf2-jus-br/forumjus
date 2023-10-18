import { OverlayTrigger, Tooltip as _Tooltip } from "react-bootstrap";


type Props = React.PropsWithChildren & {
    mensagem: string;
    posicao?: 'auto' | 'top'| 'bottom'| 'left'| 'right';
}

function Tooltip({children, mensagem, posicao} : Props){
    return (
        <OverlayTrigger placement={posicao || 'auto'} overlay={
            <_Tooltip>
              {mensagem}
            </_Tooltip>
        }>
            {children}
        </OverlayTrigger>
    )
}

export default Tooltip;