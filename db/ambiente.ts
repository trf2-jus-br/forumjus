import { RowDataPacket } from "mysql2";

type Ambientes = {[esquema: string] : Ambiente & { 
    tick: number
}}

export class AmbienteDAO {
    // Tempo de validade da informaçao armazenada, em milisegundos.
    private static readonly limite = 15 * 1000;
    private static ambientesArmazenados : Ambientes = {};


    static async listar(db: PoolConnection, esquema: string){
        if(!esquema)
            throw "O armazendo do Ambiente depende da definição do `esquema`";
        
        const ambiente = AmbienteDAO.ambientesArmazenados[esquema];
        const agora = new Date().getTime();

        // Retornada o ambiente armazenado se ele for recente.
        if(ambiente && agora - ambiente.tick < AmbienteDAO.limite){
            return ambiente;
        }

        // Caso contrário busca o ambiente no banco de dados.
        const [resultado] = await db.query(`SELECT * FROM configuracao;`) as RowDataPacket[];

        // Formata as tuplas
        const ambienteAtualizado = resultado.reduce( (acc, curr) => {
            acc[curr.nome] = curr.valor;
            return acc;
        }, {});

        // Guarda quando o registro foi atualizado
        ambienteAtualizado.tick = agora;
        AmbienteDAO.ambientesArmazenados[esquema] = ambienteAtualizado;

        // Retorna o ambiente atualizado.
        return ambienteAtualizado;
    }
}