import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

import type {
    ProjectTeam,
} from '@/types/project-team';

type Params = {
    onDelete: (
        team: ProjectTeam,
    ) => void;
};

export function buildColumns({
    onDelete,
}: Params): ColumnDef<ProjectTeam>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Equipe',
        },

        {
            accessorKey: 'leaders_count',
            header: 'Líderes',
        },

        {
            accessorKey: 'employees_count',
            header: 'Membros',
        },

        {
            id: 'actions',

            header: '',

            cell: ({ row }) => (
                <button
                    type="button"
                    onClick={() =>
                        onDelete(
                            row.original,
                        )
                    }
                    className="rounded-md p-2 text-red-600 hover:bg-red-50"
                >
                    <Trash2 size={16} />
                </button>
            ),
        },
    ];
}