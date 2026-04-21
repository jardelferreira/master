import { Home, UserLock, Building } from 'lucide-react';
import { LucideIcon, WaypointsIcon, User, FolderGit2 } from 'lucide-react';

export type BaseNavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    // controle de acesso (opcional)
    permission?: string;
    canAny?: string[];
    canAll?: string[];
    active?: string | string[] | ((ctx: any) => boolean);
    onClick?: () => void;
};

export type NavLink = BaseNavItem & {
    type: 'link';
    href: string;
};

export type NavGroup = BaseNavItem & {
    type: 'group';
    children: NavLink[];
};

export type NavigationItem = NavLink | NavGroup;

export const navigation: NavigationItem[] = [
    {
        type: 'link',
        label: 'Dashboard',
        href: '/home',
        icon: Home,
        active: 'dashboard',
    },
    {
        type: 'link',
        label: 'Usuários',
        href: route('admin.users'),
        icon: User,
        // permission: 'users.view',
        active: 'admin.users.*',
    },
    {
        type: 'link',
        label: 'Permissões',
        href: route('admin.permissions'),
        icon: UserLock,
        permission: 'permissions.view',
        active: 'admin.permissions.*',
    },
    {
        type: 'group',
        label: 'Projetos',
        href: '#',
        icon: WaypointsIcon,
        active: 'admin.projects',
        children: [
            {
                type: 'link',
                label: 'Obra SP',
                href: route('admin.projects.show'),
                icon: FolderGit2,
                active: 'admin.projects.*',
            },
        ],
    },
];
