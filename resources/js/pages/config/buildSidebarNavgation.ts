import { Home, UserLock, WaypointsIcon, User, FolderGit2, FileBox, FileText } from 'lucide-react';
import { NavigationItem } from './SidebarDashboard';


export function buildNavigation(projects: any[]): NavigationItem[] {
    return [
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

        // 🔥 PROJETOS DINÂMICOS
        {
            type: 'group',
            label: 'Projetos',
            href: '#',
            icon: WaypointsIcon,
            active: 'admin.projects.show',
            children: projects.map((project) => ({
                type: 'link',
                label: project.name,
                href: route('admin.projects.show', project.id),
                icon: FolderGit2,
                active: ({ name, params }: any) =>
                    name === 'admin.projects.show' &&
                    String(params.id) === String(project.id),
            })),
        },
        {
            type: 'group',
            label: 'suprimentos',
            href: "#",
            icon: FileBox,
            children: [
                {
                    type: 'link',
                    href: "#",
                    label: "Notas fiscais",
                    icon: FileText,
                    active: "admin.suply.invoices"
                }
            ]
        },
    ];
}