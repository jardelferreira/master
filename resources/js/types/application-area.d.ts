export type ApplicationArea = {
    id: number;

    code: string | null;

    name: string;

    description: string | null;

    parent_id: number | null;

    parent?: {
        id: number;
        name: string;
    };

    children_count: number;

    sort_order: number;

    active: boolean;
};

export type ApplicationAreaOption = {
    id: number;
    name: string;
};

export type ApplicationAreaPageProps = {
    applicationAreas: ApplicationArea[];

    parentAreas: ApplicationAreaOption[];
};