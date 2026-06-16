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
    membersCount: number;
    childrenCount: number;

    children: OrgChartNode[];
};