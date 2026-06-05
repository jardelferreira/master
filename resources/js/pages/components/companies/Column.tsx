import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import type { Company } from '@/types/company';

type Callbacks = {
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
};

export function buildColumns({
    onEdit,
    onDelete,
}: Callbacks): ColumnDef<Company>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Razão Social',
        },

        {
            accessorKey: 'trade_name',
            header: 'Nome Fantasia',

            cell: ({ row }) =>
                row.original.trade_name || '-',
        },

        {
            accessorKey: 'type_label',
            header: 'Tipo',
        },

        {
            accessorKey: 'document',
            header: 'CNPJ',

            cell: ({ row }) =>
                row.original.document || '-',
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