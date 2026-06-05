export type TeamRole =
    | 'leader'
    | 'member';

export type TeamMember = {
    id: number;
    employee_id: number;

    name: string;

    cpf: string | null;

    company_name: string | null;

    occupation_name: string | null;

    role: string;

    is_primary: boolean;

    active: boolean;
};

export type TeamMemberEmployeeOption = {
    id: number;

    name: string;

    cpf: string | null;

    label: string;
};

type FormData = {
    employee_id: number | '';

    role: string;

    is_primary: boolean;

    active: boolean;
};

type Props = {
    open: boolean;

    onClose: () => void;

    teamId: number;

    member?: TeamMember | null;

    employees: TeamMemberEmployeeOption[];

    roles: {
        value: string;
        label: string;
    }[];
};

const EMPTY_FORM: FormData = {
    employee_id: '',

    role: 'member',

    is_primary: false,

    active: true,
};