import {
    Home,
    UserLock,
    WaypointsIcon,
    User,
    Users,
    FolderGit2,
    FileBox,
    FileText,
    PlusCircle,
    Building2,
    Layers,
    Package,
    BriefcaseBusiness,
    Warehouse,
    File,
    Network,
} from 'lucide-react';

import {
    NavigationItem,
    NavLink,
} from './SidebarDashboard';

export function buildNavigation(
    projects: any[],
    onCreateProject?: () => void,
): NavigationItem[] {
    return [
        {
            type: 'link',
            label: 'Dashboard',
            href: '/home',
            icon: Home,
            active: 'dashboard',
        },

        {
            type: 'group',
            label: 'Administração',
            href: '#',
            icon: UserLock,

            children: [
                {
                    type: 'link',
                    label: 'Usuários',
                    href: route('admin.users'),
                    icon: User,
                    active: 'admin.users.*',
                },

                {
                    type: 'link',
                    label: 'Permissões',
                    href: route(
                        'admin.permissions',
                    ),
                    icon: UserLock,
                    permission:
                        'permissions.view',
                    active:
                        'admin.permissions.*',
                },
            ],
        },

        {
            type: 'group',
            label: 'Projetos',
            href: '#',
            icon: WaypointsIcon,
            active:
                'admin.projects.show',

            children: [
                {
                    type: 'link',
                    label: 'Novo Projeto',
                    href: '?modal=create',
                    onClick:
                        onCreateProject,
                    icon: PlusCircle,
                    permission:
                        'permissions.view',
                    active:
                        'admin.projects',
                },

                ...projects.map<NavLink>(
                    (project) => ({
                        type: 'link',
                        label:
                            project.name,
                        href: route(
                            'admin.projects.show',
                            project.id,
                        ),
                        icon: FolderGit2,

                        active: ({
                            name,
                            params,
                        }: any) =>
                            name ===
                            'admin.projects.show' &&
                            String(
                                params.id,
                            ) ===
                            String(
                                project.id,
                            ),
                    }),
                ),
            ],
        },

        {
            type: 'group',
            label: 'Suprimentos',
            href: '#',
            icon: FileBox,

            children: [
                {
                    type: 'link',
                    href: route(
                        'admin.invoices.index',
                    ),
                    label:
                        'Notas Fiscais',
                    icon: FileText,
                    active:
                        'admin.invoices.index',
                },

                {
                    type: 'link',
                    href: route(
                        'admin.providers.index',
                    ),
                    label:
                        'Fornecedores',
                    icon: Building2,
                    active:
                        'admin.providers.index',
                },

                {
                    type: 'link',
                    href: route(
                        'admin.categories.index',
                    ),
                    label:
                        'Categorias',
                    icon: Layers,
                    active:
                        'admin.categories.index',
                },

                {
                    type: 'link',
                    href: route(
                        'admin.products.index',
                    ),
                    label:
                        'Produtos',
                    icon: Package,
                    active:
                        'admin.products.index',
                },
            ],
        },

        {
            type: 'group',
            label: 'Cadastros',
            href: '#',
            icon: File,

            children: [
                {
                    type: 'link',
                    href: route(
                        'admin.settings.occupations.index',
                    ),
                    label:
                        'Ocupações',
                    icon:
                        BriefcaseBusiness,
                    active:
                        'admin.settings.occupations.index',
                },

                {
                    type: 'link',
                    href: route(
                        'admin.settings.companies.index',
                    ),
                    label:
                        'Empresas',
                    icon: Building2,
                    active:
                        'admin.settings.companies.index',
                },

                {
                    type: 'link',
                    href: route(
                        'admin.settings.employees.index',
                    ),
                    label:
                        'Colaboradores',
                    icon: Users,
                    active:
                        'admin.settings.employees.index',
                },
                {
                    type: 'link',
                    href: route(
                        'admin.settings.teams.index',
                    ),
                    label: 'Equipes',
                    icon: Network,
                    active:
                        'admin.settings.teams.index',
                },
                {
                    type: 'link',
                    label: 'Organograma',
                    href: route(
                        'admin.settings.teams.org-chart',
                    ),
                    icon: Network,
                    active: 'admin.settings.teams.org-chart',
                },
                {
                    type: 'link',
                    label: 'Áreas de aplicação',
                    href: route(
                        'admin.settings.application-areas.index',
                    ),
                    icon: Network,
                    active: 'admin.application-areas.index',
                },
            ],
        },

        {
            type: 'link',
            href: route(
                'warehouse.index',
            ),
            label:
                'Estoques',
            icon: Warehouse,
            active:
                'warehouse.index',
        },
    ];
}