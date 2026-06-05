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