import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from './utils/jwt';
import { NextApiRequest } from 'next';

// defino as rotas que dispensam autenticação.
const rotas_publicas = [
    "/api/login", 
    "/api/register",
    "/api/forums"
];

export async function middleware(request: NextRequest) {
    // verifico se estou tentado acessar é uma das rotas publicas.
    const rota_publica = rotas_publicas.some(r => r === request.nextUrl.pathname);

    try {
        // no caso de rotas protegidas, verifico se o usuário está autenticado.
        if(!rota_publica){
            const token = request.cookies.get('forum_token').value;
            await jwt.parseJwt( token )
        }
    } catch(err) {
        console.log('err', err)
        return new NextResponse(null, { status: 403 })
    }

    return NextResponse.next();
}

interface Usuario {
    nome: string;
    matricula: string;
    lotacao: string;
}

export async function carregarUsuario(req: NextApiRequest) : Promise<Usuario> {
    return jwt.parseJwt( req.cookies['forum_token'] )
}

export const config = {
  matcher: '/api/(.*)',
}