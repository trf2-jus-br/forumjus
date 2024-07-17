
export namespace CRUD {
    type Tipo = "Texto" | "TextArea" |  "Data" | "Arquivo";

    // Configurações visuais das colunas do banco.
    interface Coluna {
        nome: string;
        banco: string;
        largura: number;
        exibir?: boolean;
        tipo?: Tipo;
    }

    // Permite configurar linhas específicas.
    interface Linha {
        identificador_nome: string;             // "ID"
        identificador_valor: keyof Ambiente;    // 8
        coluna: string;                         // "data_nascimento"
        tipo: Tipo;                             // "Data"
    }

    interface Props {
        nome: string;
        colunas: Coluna[],
        linhas?: Linha[],
        api: string,
    }
}