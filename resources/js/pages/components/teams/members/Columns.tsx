import { ColumnDef } from '@tanstack/react-table';
import {
    Pencil,
    Trash2,
} from 'lucide-react';

import {
    TeamMember,
} from '@/types/team-member';

type Callbacks = {
    onEdit: (
        member: TeamMember,
    ) => void;

    onDelete: (
        member: TeamMember,
    ) => void;
};

export function buildColumns({
    onEdit,
    onDelete,
}: Callbacks): ColumnDef<TeamMember>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Nome',
        },

        {
            accessorKey: 'company_name',
            header: 'Empresa',

            cell: ({ row }) =>
                row.original
                    .company_name ?? '-',
        },

        {
            accessorKey:
                'occupation_name',

            header: 'Ocupação',

            cell: ({ row }) =>
                row.original
                    .occupation_name ??
                '-',
        },

        {
            accessorKey: 'role',

            header: 'Papel',

            cell: ({ row }) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        row.original
                            .role ===
                        'leader'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-base-100 text-base-700'
                    }`}
                >
                    {row.original
                        .role ===
                    'leader'
                        ? 'Líder'
                        : 'Membro'}
                </span>
            ),
        },

        {
            accessorKey:
                'is_primary',

            header:
                'Principal',

            cell: ({ row }) =>
                row.original
                    .is_primary
                    ? '✓'
                    : '-',
        },

        {
            accessorKey:
                'active',

            header: 'Status',

            cell: ({ row }) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        row.original
                            .active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {row.original
                        .active
                        ? 'Ativo'
                        : 'Inativo'}
                </span>
            ),
        },

        {
            id: 'actions',

            header: '',

            meta: {
                className:
                    'w-24 text-right',
            },

            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            onEdit(
                                row.original,
                            )
                        }
                        className="rounded p-1 text-base-500 hover:bg-base-100"
                    >
                        <Pencil
                            size={16}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            onDelete(
                                row.original,
                            )
                        }
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                    >
                        <Trash2
                            size={16}
                        />
                    </button>
                </div>
            ),
        },
    ];
}