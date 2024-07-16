
export namespace CRUD {
    type Tipo = "Texto" |  "Data" | "Arquivo";

    interface Coluna<R> {
        nome: string;
        banco: string;
        largura: number;
        exibir?: boolean;
        tipo?: Tipo;
    }

    interface Props<R> {
        nome: string;
        colunas: Coluna<R>[],
        api: string,
    }
}