export type Provider = {
    id: number;
    uuid: string;

    name: string;
    trade_name: string | null;
    display_name?: string;

    document: string | null;

    email: string | null;
    phone: string | null;
    website: string | null;

    contact_name: string | null;

    city: string | null;
    state: string | null;

    active: boolean;

    meta: Record<string, unknown> | null;

    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

