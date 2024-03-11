// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import "../components/custom-select/estilo.css"
import {ContextoProvider} from "../contexto";
import '../styles/globals.css'

config.autoAddCss = false

// own css files here
// import "../css/customcss.css";
export default function MyApp({ Component, pageProps }) {
    return <ContextoProvider>
        <Component {...pageProps} />
    </ContextoProvider>
}