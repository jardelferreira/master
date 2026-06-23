import {
    LayoutDashboard,
    Boxes,
    History,
    FolderGit2,
    Warehouse,
} from 'lucide-react';

type Project = {
    id: number;
    name: string;
};

export type StockNavigationItem =
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
        children: StockNavigationItem[];
    };

export function buildStockNavigation(
    projects: Project[],
): StockNavigationItem[] {
    return [
        {
            type: 'link',
            label: 'Painel de projetos',
            href: route('stock.index'),
            icon: Warehouse,
            active: 'warehouse.index',
        },

        ...projects.map((project) => ({
            type: 'link' as const,
            label: project.name,
            href: route('stock.projects.estoque', project.id),
            icon: FolderGit2,
            active: ({ name, params }: any) =>
                name ===
                'stock.projects.estoque' &&
                String(params.project) ===
                String(project.id),
        })),
    ];
}