import { ColumnDef } from '@tanstack/react-table';
import {
    Pencil,
    Trash2,
    Users,
} from 'lucide-react';

import type { Team } from '@/types/team';

type Callbacks = {
    onEdit: (team: Team) => void;

    onDelete: (team: Team) => void;

    onManageMembers: (
        team: Team,
    ) => void;
};

export function buildColumns({
    onEdit,
    onDelete,
    onManageMembers,
}: Callbacks): ColumnDef<Team>[] {
    return [
        {
            accessorKey: 'name',

            header: 'Equipe',

            cell: ({ row }) => (
                <div>
                    <div className="font-medium">
                        {
                            row.original
                                .name
                        }
                    </div>

                    {row.original
                        .code && (
                        <div className="text-xs text-base-500">
                            {
                                row
                                    .original
                                    .code
                            }
                        </div>
                    )}
                </div>
            ),
        },

        {
            accessorKey:
                'parent_name',

            header: 'Equipe Pai',

            cell: ({ row }) =>
                row.original
                    .parent_name ??
                '-',
        },

        {
            accessorKey:
                'leaders_count',

            header: 'Líderes',
        },

        {
            accessorKey:
                'employees_count',

            header: 'Membros',
        },

        {
            accessorKey:
                'children_count',

            header: 'Subequipes',
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
                        ? 'Ativa'
                        : 'Inativa'}
                </span>
            ),
        },

        {
            id: 'actions',

            header: '',

            meta: {
                className:
                    'w-36 text-right',
            },

            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            onManageMembers(
                                row.original,
                            )
                        }
                        className="rounded p-1 text-core-600 hover:bg-core-50"
                        title="Gerenciar membros"
                    >
                        <Users
                            size={16}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            onEdit(
                                row.original,
                            )
                        }
                        className="rounded p-1 text-base-500 hover:bg-base-100"
                        title="Editar"
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
                        title="Excluir"
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