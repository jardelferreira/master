import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ClipboardCheck, Pencil } from 'lucide-react';

import { Button } from '@/components/ui';

import InventoryStatusBadge from './InventoryStatusBadge';

export interface InventoryItemRow {
    id: number;

    product: {
        id: number;
        name: string;
        sku: string | null;
        unit: string | null;
    };

    count: {
        system_quantity: number;
        counted_quantity: number | null;
        difference: number | null;
        notes: string | null;
        operator: {
            id: number | null;
            name: string | null;
        };
    };

    status: {
        counted: boolean;
        needs_adjustment: boolean;
        label: string;
        badge: string;
    };
}

function sortableHeader(title: string) {
    return ({ column }: any) => (
        <Button
            variant="ghost"
            className="px-0 hover:bg-transparent"
            onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
            }
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

export function inventoryColumns(
    onCount: (item: InventoryItemRow) => void,
): ColumnDef<InventoryItemRow>[] {
    return [
        {
            id: 'actions',

            header: '',

            enableSorting: false,

            size: 60,

            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCount(row.original)}
                >
                    <ClipboardCheck className="h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'product.name',
            header: sortableHeader('Produto'),
            cell: ({ row }) => (

                <div>
                    <div className="font-medium">
                        {row.original.product.name}
                    </div>
                    <div className="text-xs text-base-500">
                        {row.original.product.sku ?? 'Sem SKU'}
                    </div>
                </div>

            ),
        },

        // {
        //     accessorKey: 'product.sku',
        //     header: sortableHeader('SKU'),
        // },

        {
            accessorKey: 'product.unit',

            header: sortableHeader('Un.'),

            cell: ({ row }) => (

                <div className="text-center uppercase">
                    {row.original.product.unit}
                </div>

            ),

            size: 70,
        },

        {
            accessorKey: 'system_quantity',
            header: sortableHeader('Sistema'),

            cell: ({ row }) => (
                <div className="text-center font-semibold">
                    {row.original.count.system_quantity}
                </div>
            ),
        },

        {
            id: 'counted_quantity',
            header: sortableHeader('Contado'),

            cell: ({ row }) => (
                <div className="text-center font-semibold">
                    {row.original.count.counted_quantity ?? 0}
                </div>
            ),
        },

        {
            accessorKey: 'difference',
            header: sortableHeader('Diferença'),

            cell: ({ row }) => {

                const value = row.original.count.difference;

                if (value === null) {
                    return '-';
                }

                if (value === 0) {
                    return (
                        <div className="text-center">
                            <div className="font-semibold">
                                0
                            </div>

                            <div className="text-xs text-base-500">
                                Sem diferença
                            </div>
                        </div>
                    );
                }

                const positive = value > 0;
                const equal = value == 0;

                return (
                    <div className="text-center">

                        <div
                            className={
                                equal ? 'text xs text-blue-600':
                                positive
                                    ? 'font-bold text-emerald-600'
                                    : 'font-bold text-red-600'
                            }
                        >
                            {positive && '+'}
                            {value}
                        </div>

                        <div
                            className={
                                equal ? 'text xs text-blue-600':
                                positive
                                    ? 'text-xs text-emerald-600'
                                    : 'text-xs text-red-600'
                            }
                        >
                            {equal ? "Confere": positive ? 'Acima' : 'Abaixo'}
                        </div>

                    </div>
                );

            },
        },

        {
            accessorKey: 'operator.name',
            header: sortableHeader('Operador'),

            cell: ({ row }) => (
                <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-core-50">
                        {row.original.count.operator?.name}
                    </div>
                </div>
            )

        },

        {
            accessorKey: 'status.label',
            header: sortableHeader('Status'),

            cell: ({ row }) => (
                <InventoryStatusBadge
                    status={row.original.status}
                />
            ),
        },

        {
            accessorKey: 'notes',
            header: 'Observações',

            cell: ({ row }) => (
                <div className="max-w-[220px] truncate">
                    {row.original.count.notes ?? '-'}
                </div>
            ),
        },
    ];
}