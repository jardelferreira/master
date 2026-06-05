export type OrgChartNode = {
    id: number;

    name: string;

    leaders: {
        id: number;
        name: string;
    }[];

    members: {
        id: number;
        name: string;
    }[];
    members_count: number;
    children_count: number;

    children: OrgChartNode[];
};