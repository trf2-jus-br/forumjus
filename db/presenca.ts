class PresencaDAO {
    static async listaPresentes(db : API['db']){
        const SQL = 
            `SELECT membro.* 
            FROM membro
            JOIN presenca ON membro.id = presenca.membro
            WHERE saida IS NULL;`
        const [resultado] = await db.query(SQL, []);
        
        return resultado;
    }

    static async usuarioPresente(db : API['db'], votacao: number, usuario: Usuario){
        // Esta funcionalidade foi desenvolvida na véspera do evento e não foi amplamente testada. 
        // Por esta razão, permito que a verificação seja desabilita ( caso necessário );
        const [desabilitarVerificacao] = await db.query(
            `SELECT * 
            FROM configuracao 
            WHERE nome = 'DESABILITAR_VALIDAÇÃO_PRESENÇA';`
        ) as any [];

        if(desabilitarVerificacao[0]?.valor?.toLowerCase() === "true"){
            return true;
        }

        const SQL = 
            `SELECT *
                FROM presenca, votacao
                WHERE
                    votacao.id = ? AND
                    presenca.membro = ? AND
                    ( 
                        (presenca.saida IS NULL OR presenca.saida >= votacao.inicio) AND 
                        (presenca.entrada <= votacao.fim OR votacao.fim IS NULL) 
                    );`

        const [resultado] = await db.query(SQL, [votacao, usuario.id]) as any[];
        
        return resultado.length === 1;
    }
}

export default PresencaDAO;