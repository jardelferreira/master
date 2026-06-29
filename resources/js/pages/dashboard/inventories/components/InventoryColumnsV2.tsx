import { ClipboardCheck } from 'lucide-react';
import { Column } from '@tanstack/react-table';

import { Button } from '@/components/ui';
import InventoryStatusBadge from './InventoryStatusBadge';

import { DataTableColumn } from '@/components/datatable/DatatableColumn';

/* -------------------------------------------------------------------------- */
/* Row shape                                                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** Typed sortable header — no more `any`. */
function SortableHeader({
    column,
    title,
}: {
    column: Column<InventoryItemRow>;
    title: string;
}) {
    const sorted = column.getIsSorted();
    return (
        <button
            type="button"
            className="inline-flex items-center gap-1.5 px-0 font-semibold hover:text-blue-600"
            onClick={() => column.toggleSorting(sorted === 'asc')}
        >
            {title}
            <svg
                width="10"
                height="14"
                viewBox="0 0 10 14"
                fill="none"
                className={sorted ? 'text-blue-600' : 'text-slate-300'}
            >
                <path
                    d="M5 1L5 13M5 1L2 4M5 1L8 4"
                    stroke={sorted === 'asc' ? 'currentColor' : '#cbd5e1'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M5 13L2 10M5 13L8 10"
                    stroke={sorted === 'desc' ? 'currentColor' : '#cbd5e1'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/* Columns                                                                     */
/* -------------------------------------------------------------------------- */

export function inventoryColumnsV2(
    onCount: (item: InventoryItemRow) => void,
): DataTableColumn<InventoryItemRow>[] {
    return [
        /* ── Ação ─────────────────────────────────────────────────────────── */
        {
            id: 'actions',
            header: '',
            enableSorting: false,
            enableHiding: false,
            size: 52,
            meta: {
                label: 'Ações',
                export: {
                    // Never show the action button column in exports/print
                    exportable: false,
                },
            },
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCount(row.original)}
                    title="Registrar contagem"
                >
                    <ClipboardCheck className="h-4 w-4" />
                </Button>
            ),
        },

        /* ── Produto ──────────────────────────────────────────────────────── */
        {
            id: 'product',
            accessorFn: (row) => row.product.name,
            header: ({ column }) => (
                <SortableHeader column={column} title="Produto" />
            ),
            meta: {
                label: 'Produto',
                export: {
                    title: 'Produto',
                    width: 30,
                    // Export plain name + SKU as "Nome (SKU)" string
                    formatter: (_, row) => {
                        const r = row as InventoryItemRow;
                        const sku = r.product.sku ? ` (${r.product.sku})` : '';
                        return `${r.product.name}${sku}`;
                    },
                },
            },
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.product.name}</div>
                    <div className="text-xs text-slate-400">
                        {row.original.product.sku ?? 'Sem SKU'}
                    </div>
                </div>
            ),
        },

        /* ── Unidade ──────────────────────────────────────────────────────── */
        {
            id: 'unit',
            accessorFn: (row) => row.product.unit ?? '',
            header: ({ column }) => (
                <SortableHeader column={column} title="Un." />
            ),
            size: 70,
            meta: {
                label: 'Unidade',
                className: 'text-center',
                export: {
                    title: 'Unidade',
                    width: 10,
                    align: 'center',
                },
            },
            cell: ({ getValue }) => (
                <div className="text-center uppercase">
                    {(getValue() as string) || '—'}
                </div>
            ),
        },

        /* ── Qtd. Sistema ─────────────────────────────────────────────────── */
        {
            id: 'system_quantity',
            accessorFn: (row) => row.count.system_quantity,
            header: ({ column }) => (
                <SortableHeader column={column} title="Sistema" />
            ),
            meta: {
                label: 'Qtd. Sistema',
                className: 'text-center',
                export: {
                    title: 'Qtd. Sistema',
                    width: 14,
                    align: 'right',
                },
            },
            cell: ({ getValue }) => (
                <div className="text-center font-semibold">
                    {getValue() as number}
                </div>
            ),
        },

        /* ── Contado ──────────────────────────────────────────────────────── */
        {
            id: 'counted_quantity',
            accessorFn: (row) => row.count.counted_quantity,
            header: ({ column }) => (
                <SortableHeader column={column} title="Contado" />
            ),
            meta: {
                label: 'Contado',
                className: 'text-center',
                export: {
                    title: 'Contado',
                    width: 12,
                    align: 'right',
                    // null means "not yet counted" — export that explicitly
                    formatter: (value) =>
                        value === null ? 'Não contado' : (value as number),
                },
            },
            cell: ({ getValue }) => {
                const v = getValue() as number | null;
                return (
                    <div className="text-center font-semibold">
                        {v ?? <span className="text-slate-400">—</span>}
                    </div>
                );
            },
        },

        /* ── Diferença ────────────────────────────────────────────────────── */
        {
            id: 'difference',
            accessorFn: (row) => row.count.difference,
            header: ({ column }) => (
                <SortableHeader column={column} title="Diferença" />
            ),
            meta: {
                label: 'Diferença',
                className: 'text-center',
                export: {
                    title: 'Diferença',
                    width: 12,
                    align: 'right',
                    formatter: (value) => {
                        if (value === null) return '-';
                        const n = value as number;
                        return n > 0 ? `+${n}` : String(n);
                    },
                },
            },
            cell: ({ getValue }) => {
                const value = getValue() as number | null;

                if (value === null) return <span className="text-slate-300">—</span>;

                if (value === 0) {
                    return (
                        <div className="text-center">
                            <div className="font-semibold">0</div>
                            <div className="text-xs text-slate-400">Sem diferença</div>
                        </div>
                    );
                }

                const positive = value > 0;
                return (
                    <div className="text-center">
                        <div
                            className={
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
                                positive ? 'text-xs text-emerald-500' : 'text-xs text-red-500'
                            }
                        >
                            {positive ? 'Acima' : 'Abaixo'}
                        </div>
                    </div>
                );
            },
        },

        /* ── Operador ─────────────────────────────────────────────────────── */
        {
            id: 'operator',
            accessorFn: (row) => row.count.operator.name ?? '',
            header: ({ column }) => (
                <SortableHeader column={column} title="Operador" />
            ),
            meta: {
                label: 'Operador',
                export: {
                    title: 'Operador',
                    width: 20,
                },
            },
            cell: ({ getValue }) => (
                <span>{(getValue() as string) || <span className="text-slate-300">—</span>}</span>
            ),
        },

        /* ── Status ───────────────────────────────────────────────────────── */
        {
            id: 'status',
            accessorFn: (row) => row.status.label,
            header: ({ column }) => (
                <SortableHeader column={column} title="Status" />
            ),
            meta: {
                label: 'Status',
                export: {
                    title: 'Status',
                    width: 16,
                    // Export the plain text label, not the badge JSX
                    formatter: (_, row) => (row as InventoryItemRow).status.label,
                },
            },
            cell: ({ row }) => (
                <InventoryStatusBadge status={row.original.status} />
            ),
        },

        /* ── Observações ──────────────────────────────────────────────────── */
        {
            id: 'notes',
            accessorFn: (row) => row.count.notes ?? '',
            header: 'Observações',
            meta: {
                label: 'Observações',
                export: {
                    title: 'Observações',
                    width: 40,
                },
            },
            cell: ({ getValue }) => (
                <div className="max-w-[220px] truncate text-slate-500">
                    {(getValue() as string) || '—'}
                </div>
            ),
        },
    ];
}