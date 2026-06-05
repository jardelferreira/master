import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import { Occupation } from '@/types/occupation';

type Callbacks = {
    onEdit: (occupation: Occupation) => void;
    onDelete: (
        occupation: Occupation,
    ) => void;
};

export function buildColumns({
    onEdit,
    onDelete,
}: Callbacks): ColumnDef<Occupation>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Nome',
        },

        {
            accessorKey: 'description',
            header: 'Descrição',

            cell: ({ row }) =>
                row.original.description ??
                '-',
        },

        {
            accessorKey: 'active',
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
                        className="text-red-600"
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