import { Pencil, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import type {
    ApplicationArea,
} from '@/types/application-area';

type Params = {
    onEdit: (
        area: ApplicationArea,
    ) => void;

    onDelete: (
        area: ApplicationArea,
    ) => void;
};

export function buildColumns({
    onEdit,
    onDelete,
}: Params): ColumnDef<ApplicationArea>[] {
    return [
        {
            accessorKey: 'code',

            header: 'Código',

            cell: ({ row }) => (
                <span>
                    {row.original.code ??
                        '-'}
                </span>
            ),
        },

        {
            accessorKey: 'name',

            header: 'Nome',
        },

        {
            id: 'parent',

            header: 'Área Pai',

            cell: ({ row }) => (
                <span>
                    {row.original.parent
                        ?.name ?? '-'}
                </span>
            ),
        },

        {
            accessorKey:
                'children_count',

            header: 'Subáreas',
        },

        {
            accessorKey:
                'sort_order',

            header: 'Ordem',
        },

        {
            id: 'status',

            header: 'Status',

            cell: ({ row }) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        row.original.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {row.original.active
                        ? 'Ativa'
                        : 'Inativa'}
                </span>
            ),
        },

        {
            id: 'actions',

            header: '',

            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            onEdit(
                                row.original,
                            )
                        }
                        className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
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
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
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