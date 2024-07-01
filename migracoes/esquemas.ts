interface Jornada {
    nome: string;
    enderecos: string[];
    esquema: string;
    configuracoes: []
}


export async function carregarJornadas() : Promise<Jornada[]>{
    return [
        { 
            nome: 'Jornada 3', 
            esquema: 'trfForumJus3',
            enderecos: [
                'jornada1:8081',
            ],
            configuracoes : [

            ]
        },
        { 
            nome: 'Jornada 2', 
            esquema: 'trfForumJus2',
            enderecos: [
                'jornada2:8081',
            ],
            configuracoes : [
                
            ]  
        },
    ]
}  