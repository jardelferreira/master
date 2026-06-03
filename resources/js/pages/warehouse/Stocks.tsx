import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import {
    ArrowRightLeft,
    ClipboardMinus,
    RotateCcw,
    Settings,
    Trash2,
    UserPlus,
} from 'lucide-react';

import WarehouseLayout from '@/pages/layouts/WarehouseLayout';
import { DataTable } from '@/pages/components/DataTable';

import WarehouseStockMovementModal, {
    WarehouseMovementType,
} from '@/pages/components/warehouse/WarehouseStockMovementModal';

type Project = {
    id: number;
    name: string;
};

type Stock = {
    id: number;
    uuid: string;
    project_id: number;

    product: {
        id: number;
        name: string;
        unit?: string | null;
    };

    sector?: {
        id: number;
        name: string;
    } | null;

    unit?: string | null;

    stock_quantity: number;
    min_quantity?: number | null;

    status: 'ok' | 'critical' | 'empty';
};

type ProjectUser = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    project: Project;
    stocks: Stock[];
};

export default function WarehouseStocks() {
    const { project, stocks } =
        usePage<Props>().props;

    const [selectedStock, setSelectedStock] =
        useState<Stock | null>(null);

    const [selectedMovementType, setSelectedMovementType] =
        useState<WarehouseMovementType | null>(
            null,
        );

    const [projectUsers, setProjectUsers] =
        useState<ProjectUser[]>([]);

    const [loadingUsers, setLoadingUsers] =
        useState(false);

    useEffect(() => {
        setLoadingUsers(true);

        axios
            .get(
                route(
                    'warehouse.projects.users',
                    project.id,
                ),
            )
            .then((res) =>
                setProjectUsers(res.data),
            )
            .finally(() =>
                setLoadingUsers(false),
            );
    }, [project.id]);

    function openMovement(
        stock: Stock,
        type: WarehouseMovementType,
    ) {
        setSelectedStock(stock);
        setSelectedMovementType(type);
    }

    function closeMovementModal() {
        setSelectedStock(null);
        setSelectedMovementType(null);
    }

    const stats = useMemo(
        () => ({
            total: stocks.length,

            critical: stocks.filter(
                (stock) =>
                    stock.status === 'critical',
            ).length,

            empty: stocks.filter(
                (stock) =>
                    stock.status === 'empty',
            ).length,
        }),
        [stocks],
    );

    const columns: ColumnDef<Stock>[] = [
        {
            accessorFn: (row) =>
                row.product.name,
            id: 'product',
            header: 'Produto',
            meta: {
                className:
                    'min-w-[240px]',
            },
            cell: ({ row }) => (
                <div>
                    <p className="font-semibold text-blue-950">
                        {
                            row.original.product
                                .name
                        }
                    </p>

                    <p className="text-xs text-gray-500">
                        Unidade:{' '}
                        {row.original.unit ??
                            row.original
                                .product
                                .unit ??
                            '—'}
                    </p>
                </div>
            ),
        },

        {
            accessorFn: (row) =>
                row.sector?.name ?? '',
            id: 'sector',
            header: 'Setor',
            meta: {
                className:
                    'min-w-[160px]',
            },
            cell: ({ row }) => (
                <span className="text-gray-700">
                    {row.original.sector
                        ?.name ??
                        'Sem setor'}
                </span>
            ),
        },

        {
            accessorKey: 'stock_quantity',
            header: 'Saldo',
            cell: ({ row }) => (
                <span className="font-semibold text-blue-950">
                    {
                        row.original
                            .stock_quantity
                    }
                </span>
            ),
        },

        {
            accessorKey: 'min_quantity',
            header: 'Mínimo',
            cell: ({ row }) => (
                <span className="text-gray-700">
                    {row.original
                        .min_quantity ??
                        '—'}
                </span>
            ),
        },

        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge
                    status={
                        row.original.status
                    }
                />
            ),
        },

        {
            id: 'actions',
            header: 'Ações',
            meta: {
                className:
                    'min-w-[520px]',
            },
            cell: ({ row }) => (
                <RowActions
                    stock={row.original}
                    onSelect={openMovement}
                />
            ),
        },
    ];

    return (
        <>
            <Head
                title={`Estoque · ${project.name}`}
            />

            <div className="space-y-6">
                <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                                Almoxarifado
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-blue-950">
                                {project.name}
                            </h1>

                            <p className="mt-2 text-sm text-gray-600">
                                Estoque operacional
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <MetricCard
                                label="Produtos"
                                value={
                                    stats.total
                                }
                            />

                            <MetricCard
                                label="Críticos"
                                value={
                                    stats.critical
                                }
                            />

                            <MetricCard
                                label="Sem estoque"
                                value={
                                    stats.empty
                                }
                            />
                        </div>
                    </div>
                </div>

                <DataTable<Stock>
                    data={stocks}
                    columns={columns}
                    variant="warehouse"
                    searchPlaceholder="Buscar produto ou setor..."
                    enableExport
                    enablePrint
                    exportFileName={`estoque-${project.name}`}
                    defaultPageSize={25}
                    pageSizeOptions={[
                        10, 25, 50, 100,
                    ]}
                />
            </div>

            <WarehouseStockMovementModal
                open={
                    !!selectedMovementType
                }
                movementType={
                    selectedMovementType
                }
                onClose={
                    closeMovementModal
                }
                projectId={project.id}
                stock={selectedStock}
                stocks={stocks}
                projectUsers={projectUsers}
                loadingUsers={loadingUsers}
            />
        </>
    );
}

WarehouseStocks.layout = (
    page: React.ReactNode,
) => (
    <WarehouseLayout>{page}</WarehouseLayout>
);

function MetricCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-950">
                {value}
            </p>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: 'ok' | 'critical' | 'empty';
}) {
    const styles = {
        ok: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        critical:
            'border-amber-200 bg-amber-50 text-amber-700',
        empty: 'border-red-200 bg-red-50 text-red-700',
    };

    const labels = {
        ok: 'Normal',
        critical: 'Crítico',
        empty: 'Sem estoque',
    };

    return (
        <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}

function RowActions({
    stock,
    onSelect,
}: {
    stock: Stock;
    onSelect: (
        stock: Stock,
        type: WarehouseMovementType,
    ) => void;
}) {
    const actions = [
        {
            label: 'Consumir',
            icon: ClipboardMinus,
            type: 'consumption',
            className:
                'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
        },
        {
            label: 'Transferir',
            icon: ArrowRightLeft,
            type: 'transfer',
            className:
                'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
        },
        {
            label: 'Ajustar',
            icon: Settings,
            type: 'adjust',
            className:
                'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
        },
        {
            label: 'Perda',
            icon: Trash2,
            type: 'loss',
            className:
                'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
        },
        {
            label: 'Devolver',
            icon: RotateCcw,
            type: 'return',
            className:
                'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        },
        {
            label: 'Atribuir',
            icon: UserPlus,
            type: 'assignment',
            className:
                'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
        },
    ] as const;

    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((action) => {
                const Icon =
                    action.icon;

                return (
                    <button
                        key={action.type}
                        type="button"
                        onClick={() =>
                            onSelect(
                                stock,
                                action.type,
                            )
                        }
                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${action.className}`}
                    >
                        <Icon size={14} />
                        {action.label}
                    </button>
                );
            })}
        </div>
    );
}