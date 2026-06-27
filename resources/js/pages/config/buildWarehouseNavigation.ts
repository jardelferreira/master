import {
    LayoutDashboard,
    Boxes,
    History,
    FolderGit2,
    Warehouse,
    ClipboardList,
} from 'lucide-react';

type Project = {
    id: number;
    name: string;
};

export type WarehouseNavigationItem =
    | {
          type: 'link';
          label: string;
          href: string;
          icon: any;
          active: string | ((args: any) => boolean);
      }
    | {
          type: 'group';
          label: string;
          href: string;
          icon: any;
          active?: string;
          children: WarehouseNavigationItem[];
      };

export function buildWarehouseNavigation(
    projects: Project[],
): WarehouseNavigationItem[] {
    return [
        {
            type: 'link',
            label: 'Almoxarifado',
            href: route('warehouse.index'),
            icon: Warehouse,
            active: 'warehouse.index',
        },
        {
            type: 'link',
            label: 'Inventários',
            href: route('warehouse.inventories.index'),
            icon: ClipboardList,
            active: 'warehouse.inventories.index',
        },

        ...projects.map((project) => ({
            type: 'group' as const,
            label: project.name,
            href: '#',
            icon: FolderGit2,

            children: [
                {
                    type: 'link' as const,
                    label: 'Dashboard',
                    href: route(
                        'warehouse.projects.show',
                        project.id,
                    ),
                    icon: LayoutDashboard,
                    active: ({ name, params }: any) =>
                        name ===
                            'warehouse.projects.show' &&
                        String(params.project) ===
                            String(project.id),
                },

                {
                    type: 'link' as const,
                    label: 'Estoque',
                    href: route(
                        'warehouse.projects.stocks',
                        project.id,
                    ),
                    icon: Boxes,
                    active: ({ name, params }: any) =>
                        name ===
                            'warehouse.projects.stocks' &&
                        String(params.project) ===
                            String(project.id),
                },

                {
                    type: 'link' as const,
                    label: 'Movimentações',
                    href: route(
                        'warehouse.projects.movements.index',
                        project.id,
                    ),
                    icon: History,
                    active: ({ name, params }: any) =>
                        name ===
                            'warehouse.projects.movements.index' &&
                        String(params.project) ===
                            String(project.id),
                },
            ],
        })),
    ];
}