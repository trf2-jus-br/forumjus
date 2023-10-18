
export namespace CRUD {

    interface Coluna<R> {
        nome: string;
        banco: string;
        largura: number;
        exibir?: boolean;
    }

    interface Props<R> {
        nome: string;
        colunas: Coluna<R>[],
        api: string,
    }
}