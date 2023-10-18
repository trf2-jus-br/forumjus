/*
    Classe permite acesso direito ao banco de dados.
    Foi solicitado a criação desse classe, para eventuais ajustes no banco.
 */


class CRUD {

    // Carrega uma ou várias linhas de uma tabela.
    static async carregar(db: PoolConnection,tabela: string, chave?: string, valor?: number){
        // verifica se há algum dado malicio na requisição do usuário.
        CRUD.protegerSqlInjection(tabela, chave)
        
        let condicao = ''
        let params = [];

        if(chave != null){
            params.push(valor);
            condicao = ` WHERE ${chave} = ?`;
        }

        const [result] = await db.query( `SELECT * FROM ${tabela} ${condicao};`, params)

        return result;
    }


    static async protegerSqlInjection(...campos){
        const regex = /^[a-zA-Z_]*$/;

        const injection = campos.some( txt => txt != null && !txt.match(regex))

        if(injection)
            throw "Possível Injection";
    }

    static async atualizarBanco(db: PoolConnection,tabela: string, nome_id: string, coluna: string, valor: any, id: number, usuario: Usuario){
        CRUD.protegerSqlInjection(tabela, coluna, nome_id);
        await db.query(`update ${tabela} set ${coluna} = ? where ${nome_id} = ?`, [valor, id]);
    }

    static async deletarLinha(db: PoolConnection, tabela: string, nome_id: string, id: number, usuario: Usuario){
        CRUD.protegerSqlInjection(tabela, nome_id);
        await db.query(`DELETE FROM ${tabela} WHERE ${nome_id} = ?;`, [id]);
    }

    static async criarLinha(db: PoolConnection, tabela: string, linha: Object, usuario: Usuario){
        const chaves = Object.keys(linha);
        CRUD.protegerSqlInjection(tabela, ...chaves);
        
        const campos = chaves.join(',');
        const valores = chaves.map( e => '?').join(',');

        // Tx {A: 1, B: 2} ==> INSERT INTO Tx (A, B) VALUES (?, ?);
        await db.query(`INSERT INTO ${tabela} (${campos}) VALUES (${valores});`, [ ...Object.values(linha) ]);
    }
}

export default CRUD;