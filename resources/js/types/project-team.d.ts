import type { TeamOption } from './team';

export type ProjectTeam = {
    id: number;

    name: string;

    leaders_count: number;

    employees_count: number;
};

export type ProjectTeamPageProps = {
    project: {
        id: number;
        name: string;
    };

    teams: ProjectTeam[];

    availableTeams: TeamOption[];
};