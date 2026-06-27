import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useCallback } from 'react';

import WarehouseLayout from '@/pages/layouts/WarehouseLayout';
import { DataTable } from '@/pages/components/DataTable';
import StockConsultaDrawer from '@/pages/components/warehouse/StockConsultaDrawer';
import StockLayout from '../layouts/StockLayout';

// ─── Types ───────────────────────────────────────────────────────────────────

type Project = {
    id: number;
    name: string;
};

type Sector = {
    id: number;
    name: string;
};

export type StockItem = {
    id: number;
    product_id: number;
    product_name: string;
    product_sku: string | null;
    product_unit: string | null;
    sector_id: number | null;
    sector_name: string | null;
    total_quantity: number;
    min_quantity: number | null;
    status: 'ok' | 'critical' | 'empty';
};

type Props = {
    project: Project;
    stocks: StockItem[];
    sectors: Sector[];
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function StockConsulta() {
    const { project, stocks, sectors } =
        usePage<Props>().props;

    const [selectedItem, setSelectedItem] =
        useState<StockItem | null>(null);

    const openDrawer = useCallback(
        (item: StockItem) => setSelectedItem(item),
        [],
    );

    const closeDrawer = useCallback(
        () => setSelectedItem(null),
        [],
    );

    // Estatísticas rápidas
    const stats = {
        total:    stocks.length,
        critical: stocks.filter((s) => s.status === 'critical').length,
        empty:    stocks.filter((s) => s.status === 'empty').length,
    };

    // Opções de setor para o filtro facetado
    const sectorOptions = sectors.map((s) => ({
        label: s.name,
        value: s.name,
    }));

    // ── Colunas desktop ──────────────────────────────────────────────────────
    const columns: ColumnDef<StockItem>[] = [
        {
            accessorKey: 'product_name',
            header: 'Produto',
            meta: { className: 'min-w-[200px]' },
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div>
                        <p className="font-semibold text-blue-950 leading-tight">
                            {item.product_name}
                        </p>
                        {item.product_sku && (
                            <p className="text-xs text-slate-400 mt-0.5">
                                SKU: {item.product_sku}
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'sector_name',
            header: 'Setor',
            meta: { className: 'min-w-[140px]' },
            cell: ({ row }) =>
                row.original.sector_name ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {row.original.sector_name}
                    </span>
                ) : (
                    <span className="text-slate-400">—</span>
                ),
        },
        {
            accessorKey: 'total_quantity',
            header: 'Saldo',
            cell: ({ row }) => {
                const { total_quantity, product_unit } = row.original;
                return (
                    <span className="font-bold text-blue-950 tabular-nums">
                        {total_quantity.toLocaleString('pt-BR', {
                            maximumFractionDigits: 3,
                        })}{' '}
                        <span className="text-xs font-normal text-slate-500">
                            {product_unit ?? ''}
                        </span>
                    </span>
                );
            },
        },
        {
            accessorKey: 'min_quantity',
            header: 'Mínimo',
            cell: ({ row }) =>
                row.original.min_quantity !== null ? (
                    <span className="text-slate-600 tabular-nums">
                        {row.original.min_quantity}
                    </span>
                ) : (
                    <span className="text-slate-400">—</span>
                ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge status={row.original.status} />
            ),
        },
        {
            id: 'detail',
            header: '',
            cell: ({ row }) => (
                <button
                    type="button"
                    onClick={() => openDrawer(row.original)}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 whitespace-nowrap"
                >
                    Ver detalhes
                </button>
            ),
        },
    ];

    return (
        <>
            <Head title={`Consulta · ${project.name}`} />

            <div className="space-y-5">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                                Almoxarifado · Consulta
                            </p>
                            <h1 className="mt-1 text-2xl font-bold text-blue-950 md:text-3xl">
                                {project.name}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Posição atual do estoque
                            </p>
                        </div>

                        {/* Métricas resumidas */}
                        <div className="grid grid-cols-3 gap-3 shrink-0">
                            <MetricCard
                                label="Produtos"
                                value={stats.total}
                                color="blue"
                            />
                            <MetricCard
                                label="Críticos"
                                value={stats.critical}
                                color="amber"
                            />
                            <MetricCard
                                label="Zerados"
                                value={stats.empty}
                                color="red"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Tabela desktop (hidden em mobile) ───────────────────── */}
                <div className="hidden md:block">
                    <DataTable<StockItem>
                        data={stocks}
                        columns={columns}
                        variant="warehouse"
                        searchPlaceholder="Buscar produto, SKU ou setor..."
                        defaultPageSize={25}
                        pageSizeOptions={[10, 25, 50, 100,0]}
                        enableExport
                        exportFileName={`consulta-${project.name}`}
                    />
                </div>

                {/* ── Lista mobile ────────────────────────────────────────── */}
                <MobileStockList
                    stocks={stocks}
                    onSelect={openDrawer} 
                />
            </div>

            {/* ── Drawer de detalhes ──────────────────────────────────────── */}
            <StockConsultaDrawer
                open={!!selectedItem}
                item={selectedItem}
                projectId={project.id}
                onClose={closeDrawer}
            />
        </>
    );
}

StockConsulta.layout = (page: React.ReactNode) => (
    <StockLayout>{page}</StockLayout>
);

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: 'blue' | 'amber' | 'red';
}) {
    const styles = {
        blue:  'bg-blue-50 border-blue-100 text-blue-950',
        amber: 'bg-amber-50 border-amber-100 text-amber-800',
        red:   'bg-red-50 border-red-100 text-red-800',
    };

    const labelStyles = {
        blue:  'text-blue-600',
        amber: 'text-amber-600',
        red:   'text-red-600',
    };

    return (
        <div className={`rounded-2xl border px-4 py-3 text-center ${styles[color]}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wide ${labelStyles[color]}`}>
                {label}
            </p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}

export function StatusBadge({
    status,
}: {
    status: 'ok' | 'critical' | 'empty';
}) {
    const styles = {
        ok:       'bg-emerald-50 border-emerald-200 text-emerald-700',
        critical: 'bg-amber-50 border-amber-200 text-amber-700',
        empty:    'bg-red-50 border-red-200 text-red-700',
    };

    const labels = {
        ok:       'Normal',
        critical: 'Crítico',
        empty:    'Zerado',
    };

    return (
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

// ── Lista de cards para mobile ────────────────────────────────────────────────

function MobileStockList({
    stocks,
    onSelect,
}: {
    stocks: StockItem[];
    onSelect: (item: StockItem) => void;
}) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<string>('all');

    const filtered = stocks.filter((s) => {
        const matchSearch =
            search === '' ||
            s.product_name.toLowerCase().includes(search.toLowerCase()) ||
            (s.product_sku ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (s.sector_name ?? '').toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === 'all' || s.status === statusFilter;

        return matchSearch && matchStatus;
    });

    return (
        <div className="md:hidden space-y-3">
            {/* Barra de busca mobile */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm space-y-3">
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar produto ou setor..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white transition"
                    />
                </div>

                {/* Filtro de status */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                        { value: 'all',      label: 'Todos' },
                        { value: 'ok',       label: 'Normal' },
                        { value: 'critical', label: 'Crítico' },
                        { value: 'empty',    label: 'Zerado' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setStatusFilter(opt.value)}
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                statusFilter === opt.value
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-slate-200 bg-white text-slate-600'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contador */}
            <p className="px-1 text-xs text-slate-500">
                {filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Cards */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                    <p className="text-sm text-slate-500">
                        Nenhum produto encontrado.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((item) => (
                        <button
                            key={`${item.product_id}-${item.sector_id ?? 'null'}`}
                            type="button"
                            onClick={() => onSelect(item)}
                            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition active:bg-slate-50"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-blue-950">
                                        {item.product_name}
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        {item.sector_name && (
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                                {item.sector_name}
                                            </span>
                                        )}
                                        {item.product_sku && (
                                            <span className="text-xs text-slate-400">
                                                {item.product_sku}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <StatusBadge status={item.status} />
                            </div>

                            <div className="mt-3 flex items-end justify-between">
                                <div>
                                    <p className="text-xs text-slate-500">Saldo</p>
                                    <p className="text-xl font-bold text-blue-950 tabular-nums leading-none">
                                        {item.total_quantity.toLocaleString('pt-BR', {
                                            maximumFractionDigits: 3,
                                        })}
                                        <span className="ml-1 text-sm font-normal text-slate-500">
                                            {item.product_unit ?? ''}
                                        </span>
                                    </p>
                                </div>

                                {item.min_quantity !== null && (
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Mínimo</p>
                                        <p className="text-sm font-medium text-slate-700 tabular-nums">
                                            {item.min_quantity}
                                        </p>
                                    </div>
                                )}

                                {/* Indicador visual de seta */}
                                <svg
                                    className="text-slate-300 shrink-0"
                                    width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2"
                                >
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}