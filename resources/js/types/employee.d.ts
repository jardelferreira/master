export type Employee = {
    id: number;

    name: string;

    email: string | null;
    phone: string | null;
    cpf: string | null;

    company_id: number | null;
    occupation_id: number | null;

    company_name: string | null;
    occupation_name: string | null;

    active: boolean;

    created_at: string;
    updated_at: string;
};