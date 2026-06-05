export type Team = {
    id: number;

    parent_id: number | null;

    code: string | null;

    name: string;

    description: string | null;

    parent_name: string | null;

    children_count: number;
    employees_count: number;
    leaders_count: number;

    sort_order: number;

    active: boolean;

    created_at: string;
    updated_at: string;
};

export type TeamOption = {
    id: number;
    name: string;
};

export type TeamTreeNode = {
    id: number;

    name: string;

    members: {
        id: number;
        name: string;
        role: string;
    }[];

    children: TeamTreeNode[];
};

type TeamNodeData = {
    name: string;

    leaders: string[];

    membersCount: number;
};