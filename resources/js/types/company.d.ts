export type CompanyType =
    | 'own'
    | 'third_party';

export type Company = {
    id: number;

    name: string;
    trade_name: string | null;

    document: string | null;

    email: string | null;
    phone: string | null;

    type: CompanyType;
    type_label: string;

    active: boolean;

    created_at: string;
    updated_at: string;
};