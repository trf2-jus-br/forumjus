import { Card } from "react-bootstrap";
import Layout from "../../components/layout";
import comPermissao from "../../utils/com-permissao";

function Admin(){
    const propriedades = [
        '/db',
        '/comite',
        '/enunciado',
        '/proponente',
        '/ocupacao',
        '/ambiente',
        '/arquivo',
        '/calendario',
        '/membro',
    ].sort(
        (a, b) => a > b ? 1 : -1
    );

    return <Layout>
        <div style={e.container}>
            {propriedades.map(p => (
                <a key={p} href={`/admin${p}`} style={e.card}>
                    <Card>
                        <Card.Body>{p}</Card.Body>
                    </Card>
                </a>
            ))}
        </div>
    </Layout>
}

const e : {[key: string]: React.CSSProperties} = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 50
    },
    card: {
        height: 125,
        cursor: 'pointer',
        flex: 1,
        textDecoration: 'none'
    }
}

export default comPermissao(Admin, "PROGRAMADOR");