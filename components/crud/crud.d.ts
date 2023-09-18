
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

    interface Comite {
        committee_id: number,
        forum_id: number,
        committee_name: string,
        committee_chair_name: string,
        committee_chair_document: string,
        committee_description: string,
    }

    interface Enunciado {
        statement_id: number;
        forum_id: number;
        attendee_id: number;
        committee_id: number;
        statement_text: string;
        statement_justification: string;
        statement_acceptance_datetime: string | null;
        statement_rejection_datetime: string | null;
    }
}