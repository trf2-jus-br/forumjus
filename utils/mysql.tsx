const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
});

export default {

    async getConnection() {
        return await pool.getConnection();
    },

    async register(forumId, data) {
        if (data.attendeeChosenName) {
            data.attendeeChosenName = data.attendeeChosenName.trim()
            if (data.attendeeChosenName === '') delete data.attendeeChosenName
        }
        const conn = await this.getConnection()
        conn.beginTransaction()
        try {
            const resultEmail = await conn.query('SELECT * FROM attendee WHERE attendee_email = ?;', [data.attendeeEmail])
            if (resultEmail[0].length) throw `E-mail ${data.attendeeEmail} já consta na base de inscritos`

            //const resultDocument = await conn.query('SELECT * FROM attendee WHERE attendee_document = ?;', [data.attendeeDocument])
            //if (resultDocument[0].length) throw `CPF ${data.attendeeDocument} já consta na base de inscritos`

            const result = await conn.query('INSERT INTO attendee(forum_id,occupation_id,attendee_name,attendee_chosen_name,attendee_email,attendee_phone,attendee_document,attendee_affiliation,attendee_disability) VALUES (?,?,?,?,?,?,?,?,?);',
                [forumId, data.attendeeOccupationId, data.attendeeName, data.attendeeChosenName, data.attendeeEmail, data.attendeePhone, data.attendeeDocument, data.attendeeAffiliation, data.attendeeDisability])
            const attendeeId = result[0].insertId
            data.statement.forEach(async (statement) => {
                const result = await conn.query('INSERT INTO statement(forum_id,attendee_id,committee_id,statement_text,statement_justification) VALUES (?,?,?,?,?);',
                    [forumId, attendeeId, parseInt(statement.committeeId), statement.text, statement.justification])
            })
            conn.commit()
            return attendeeId
        } catch (e) {
            conn.rollback()
            throw e
        } finally {
            conn.release()
        }
    },

    async carregarForum(){
        const conn = await pool.getConnection();

        try{
            const [result] = await conn.query( 'SELECT * FROM forum ORDER BY forum_id DESC LIMIT 1;')
            return result[0]
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },

    async loadForumConstants(forumId) {
        const conn = await this.getConnection()
        const r = {
            occupation: {},
            committee: {},
        }
        try {
            {
                const result = await conn.query('SELECT * FROM forum WHERE forum_id = ?;', [forumId])
                if (!result[0].length) throw `Jornada ${forumId} não localizada na base de dados`
                r.forumId = forumId
                r.forumName = result[0][0].forum_name
            }
            {
                const result = await conn.query('SELECT * FROM occupation WHERE forum_id = ?;', [forumId])
                for (let i = 0; i < result[0].length; i++) {
                    r.occupation[result[0][i].occupation_id] = {
                        name: result[0][i].occupation_name
                    }
                }
            }
            {
                const result = await conn.query('SELECT * FROM committee WHERE forum_id = ?;', [forumId])
                for (let i = 0; i < result[0].length; i++) {
                    r.committee[result[0][i].committee_id] = {
                        name: result[0][i].committee_name,
                        description: result[0][i].committee_description,
                        chairName: result[0][i].committee_chair_name,
                        chairDocument: result[0][i].committee_chair_document
                    }
                }
            }
        } finally {
            conn.release()
        }
        return r
    },

    async carregarPermissoes(doc: string){
        const conn = await pool.getConnection();

        try{
            const [result ] = await conn.query( `select administrar_comissoes, votar_comissoes, crud, estatistica from permissao where JSON_CONTAINS(usuarios, ?, '$');`, [`"${doc}"`])
    
            return {
                administrar_comissoes: JSON.parse(result[0]?.administrar_comissoes || '[]'),
                crud: result[0]?.crud === 1
            }
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },
    
    async alterarComite({usuario, statement_id, committee_id}){
        const conn = await pool.getConnection();

        try{
            const permissao = await this.carregarPermissoes(usuario.matricula);

            const [enunciado] = await this.carregar({tabela: 'statement', chave: 'statement_id', valor: statement_id});

            if(permissao.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
                throw "Usuário sem permissão";
            }

            const [result] = await conn.query( 
                `UPDATE statement SET committee_id = ? WHERE statement_id = ?`,
                [committee_id, statement_id]
            );
    
            return result;
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },

    async votar({matricula, statement_id, committee_id, contra}){
        const conn = await pool.getConnection();

        try{
            const permissao = await this.carregarPermissoes(matricula);

            if(permissao.administrar_comissoes.indexOf(committee_id) === -1){
                throw "Usuário sem permissão para votar."
            }

            const voto = contra ? 'statement_acceptance' : ' statement_rejection';

            const [result] = await conn.query( 
                `UPDATE statement SET ${voto} = ${voto} + 1 WHERE statement_id = ? and committee_id = ?;`,
                [statement_id, committee_id]
            , 
            [statement_id, committee_id]);
    
            return result;
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },

    async analisar({usuario, statement_id, admitido}){
        const conn = await pool.getConnection();

        try{
            const permissao = await this.carregarPermissoes(usuario.matricula);

            const [enunciado] = await this.carregar({tabela: 'statement', chave: 'statement_id', valor: statement_id});

            if(permissao.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
                throw "Usuário sem permissão para analisar."
            }

            const nome = `${usuario.nome} (${usuario.matricula})`;

            const [result] = await conn.query( 
                `UPDATE statement 
                    SET admitido = ?, 
                    analisado_por = ?, 
                    data_analise=now() 
                WHERE statement_id = ?;`,
                [admitido, nome, statement_id]
            );
    
            return result;
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },

    
    async desfazerAnalise({usuario, statement_id}){
        const conn = await pool.getConnection();

        try{
            const permissao = await this.carregarPermissoes(usuario.matricula);

            const [enunciado] = await this.carregar({tabela: 'statement', chave: 'statement_id', valor: statement_id});

            if(permissao.administrar_comissoes.indexOf(enunciado.committee_id) === -1){
                throw "Usuário sem permissão para analisar."
            }

            const [result] = await conn.query( 
                `UPDATE statement 
                    SET admitido = NULL, 
                    analisado_por = NULL, 
                    data_analise = NULL 
                WHERE statement_id = ?;`,
                [statement_id]
            );
    
            return result;
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },

    async carregarVotacaoComites(usuario){
        const permissao = await this.carregarPermissoes(usuario.matricula);

        const conn = await pool.getConnection();

        try{
            const [result] = await conn.query( 
                `select committee.*, count(*) as enunciados
                from committee
                inner join statement on committee.committee_id = statement.committee_id
                where committee.committee_id in (?)
                group by committee_id
                `, [permissao.administrar_comissoes]);

            return result;
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },
    async carregarEnunciados({ usuario }){
        const conn = await pool.getConnection();

        const permissoes = await this.carregarPermissoes(usuario.matricula);
        
        if( permissoes.administrar_comissoes.length === 0)
            throw "Usuário não tem permissão";

        try{
            const [result] = await conn.query( 
                `SELECT	statement.* 
                FROM statement, permissao
                WHERE committee_id in (?)
                ORDER BY admitido is not null, admitido desc, data_analise desc;`
            , 
            [permissoes.administrar_comissoes]);
    
            return result;
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },

    async carregar({tabela, chave, valor}){
        if(tabela == null)
            throw "tabela nula"

        const conn = await pool.getConnection();

        try{
            this.protegerSqlInjection(tabela, chave)
            
            let condicao = ''
            let params = [];

            if(chave != null){
                params.push(valor);
                condicao = ` WHERE ${chave} = ?`;
            }

            const [result] = await conn.query( `SELECT * FROM ${tabela} ${condicao};`, params)
    
            return result;
        }catch(err){
            throw err;
        } finally {
            conn.release();
        }
    },
    async protegerSqlInjection(...campos){
        const regex = /^[a-zA-Z_]*$/;

        const injection = campos.some( txt => txt != null && !txt.match(regex))

        if(injection)
            throw "Possível Injection";
    },
    async atualizarBanco({tabela, nome_id, coluna, valor, id, usuario}){
        const conn = await pool.getConnection();

       this.protegerSqlInjection(tabela, coluna, nome_id);

        const [result] = await conn.query(`update ${tabela} set ${coluna} = ? where ${nome_id} = ?`, [valor, id]);

        conn.release();

        return result;
    },
    async deletarLinha({tabela, nome_id, id, usuario}){
        const conn = await pool.getConnection();

        this.protegerSqlInjection(tabela, nome_id);

        const [result] = await conn.query(`DELETE FROM ${tabela} WHERE ${nome_id} = ?;`, [id]);

        conn.release();

        return result;
    },
    async criarLinha({tabela, linha, usuario}){

        this.protegerSqlInjection(tabela, ...Object.keys(linha));
        
        const conn = await pool.getConnection();

        const campos = Object.keys(linha).join(',');
        const valores = Object.keys(linha).map( e => '?').join(',');

        const [result] = await conn.query(`INSERT INTO ${tabela} (${campos}) VALUES (${valores});`, [ ...Object.values(linha) ]);

        conn.release();

        return result;
    },

    async carregarInscricoes(){
        const conn = await pool.getConnection();

        const [result] = await conn.query( 
            `SELECT 
                attendee_acceptance_datetime, attendee_affiliation,
                attendee_chosen_name, attendee_disability, attendee_document
                attendee_email, statement.attendee_id, attendee_name,
                attendee_phone, attendee_rejection_datetime, statement.committee_id, occupation_id,
                statement_acceptance_datetime, statement_id, statement_justification,
                statement_rejection_datetime, statement_text
            FROM 
                statement join attendee on statement.attendee_id = attendee.attendee_id;`
        )

        conn.release();

        return result;
    },

    async aprovar(id){
        const conn = await pool.getConnection();

        await conn.query( 
            `UPDATE statement 
                SET statement_acceptance_datetime = now(),
                statement_rejection_datetime = NULL 
                WHERE statement_id = ?;`, 
        [id])

        conn.release();
    },

    async rejeitar(id){
        const conn = await pool.getConnection();

        const [result] = await conn.query( 
            `UPDATE statement 
                SET statement_acceptance_datetime = NULL,
                statement_rejection_datetime = now() 
                WHERE statement_id = ?;`, 
        [id])

        conn.release();

        return result;
    },
}