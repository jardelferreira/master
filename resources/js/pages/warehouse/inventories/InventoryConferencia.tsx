import { Head, usePage } from '@inertiajs/react';
import { useState, useCallback, useMemo } from 'react';
import StockLayout from '@/pages/layouts/StockLayout';
import InventoryConferenciaDrawer from '@/pages/components/warehouse/InventoryConferenciaDrawer';

// ─── Types ───────────────────────────────────────────────────────────────────

export type InventoryItem = {
    id: number;
    product: {
        id: number;
        name: string;
        sku: string | null;
        unit: string | null;
        category: string | null;
    };
    stock: {
        id: number;
        sector: { id: number | null; name: string | null };
        location: string | null;
    };
    count: {
        system_quantity: number;
        counted_quantity: number | null;
        difference: number | null;
        notes: string | null;
        counted_at: string | null;
        operator: { id: number | null; name: string | null };
        permissions: { can_count: boolean; readonly: boolean };
    };
    status: {
        counted: boolean;
        needs_adjustment: boolean;
        label: string;
        badge: string;
    };
};

type Statistics = {
    total: number;
    counted: number;
    pending: number;
    adjustments: number;
};

type Inventory = {
    id: number;
    name: string;
    blind_count: boolean;
    project: { id: number; name: string };
    status: {
        value: string;
        label: string;
        badge: string;
        permissions: Record<string, boolean>;
    };
    statistics: Statistics;
    items: InventoryItem[];
};

type Props = {
    inventory: Inventory;
};

type FilterTab = 'all' | 'pending' | 'counted';

// ─── Component ───────────────────────────────────────────────────────────────

export default function InventoryConferencia() {
    const { inventory: initial } = usePage<Props>().props;

    // Estado local para atualização otimista após contagem
    const [items, setItems]           = useState<InventoryItem[]>(initial.items);
    const [statistics, setStatistics] = useState<Statistics>(initial.statistics);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    // Filtros
    const [tab, setTab]         = useState<FilterTab>('all');
    const [search, setSearch]   = useState('');

    const canCount = initial.status.permissions?.can_count ?? false;

    // ── Filtragem ────────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const matchTab =
                tab === 'all' ||
                (tab === 'pending' && !item.status.counted) ||
                (tab === 'counted' && item.status.counted);

            const q = search.toLowerCase();
            const matchSearch =
                q === '' ||
                item.product.name.toLowerCase().includes(q) ||
                (item.product.sku ?? '').toLowerCase().includes(q) ||
                (item.stock.sector.name ?? '').toLowerCase().includes(q);

            return matchTab && matchSearch;
        });
    }, [items, tab, search]);

    // ── Callbacks ────────────────────────────────────────────────────────────

    const openDrawer = useCallback(
        (item: InventoryItem) => {
            if (!canCount) return;
            setSelectedItem(item);
        },
        [canCount],
    );

    const closeDrawer = useCallback(() => setSelectedItem(null), []);

    /**
     * Recebe o item atualizado + estatísticas do servidor
     * e atualiza o estado local sem reload.
     */
    const handleItemUpdated = useCallback(
        (updatedItem: InventoryItem, updatedStats: Statistics) => {
            setItems((prev) =>
                prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
            );
            setStatistics(updatedStats);
            setSelectedItem(updatedItem);
        },
        [],
    );

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            <Head title={`Conferência · ${initial.name}`} />

            <div className="min-h-dvh bg-slate-50 pb-10">

                {/* ── Header ────────────────────────────────────────────── */}
                <div className="sticky top-0 z-10 border-b border-blue-100 bg-white px-4 pb-4 pt-5 shadow-sm">

                    {/* Voltar + título */}
                    <div className="mb-3 flex items-center gap-3">
                        <a
                            href={route('warehouse.inventories.index')}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </a>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                                {initial.project.name}
                            </p>
                            <h1 className="truncate text-lg font-bold text-blue-950 leading-tight">
                                {initial.name}
                            </h1>
                        </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-2">
                        <MetricCard
                            label="Total"
                            value={statistics.total}
                            color="blue"
                        />
                        <MetricCard
                            label="Contados"
                            value={statistics.counted}
                            color="green"
                        />
                        <MetricCard
                            label="Pendentes"
                            value={statistics.pending}
                            color={statistics.pending > 0 ? 'amber' : 'green'}
                        />
                    </div>

                    {/* Barra de progresso */}
                    {statistics.total > 0 && (
                        <div className="mt-3">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        statistics.pending === 0 ? 'bg-emerald-500' : 'bg-blue-500'
                                    }`}
                                    style={{
                                        width: `${Math.round((statistics.counted / statistics.total) * 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Busca */}
                    <div className="mt-3 relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            width="15" height="15" viewBox="0 0 24 24"
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
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white transition"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="mt-3 flex gap-2">
                        {(
                            [
                                { value: 'all',     label: 'Todos',     count: statistics.total },
                                { value: 'pending', label: 'Pendentes', count: statistics.pending },
                                { value: 'counted', label: 'Contados',  count: statistics.counted },
                            ] as { value: FilterTab; label: string; count: number }[]
                        ).map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => setTab(t.value)}
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                    tab === t.value
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-slate-200 bg-white text-slate-600'
                                }`}
                            >
                                {t.label}
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                        tab === t.value
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Lista de itens ─────────────────────────────────────── */}
                <div className="px-4 pt-4 space-y-2">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                            <p className="text-sm text-slate-500">
                                {search
                                    ? 'Nenhum item encontrado para esta busca.'
                                    : 'Nenhum item nesta categoria.'}
                            </p>
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                blindCount={initial.blind_count}
                                canCount={canCount}
                                onSelect={openDrawer}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ── Drawer de contagem ─────────────────────────────────────── */}
            <InventoryConferenciaDrawer
                open={selectedItem !== null}
                item={selectedItem}
                inventoryId={initial.id}
                blindCount={initial.blind_count}
                canCount={canCount}
                onClose={closeDrawer}
                onItemUpdated={handleItemUpdated}
            />
        </>
    );
}

// ─── Card de item ─────────────────────────────────────────────────────────────

function ItemCard({
    item,
    blindCount,
    canCount,
    onSelect,
}: {
    item: InventoryItem;
    blindCount: boolean;
    canCount: boolean;
    onSelect: (item: InventoryItem) => void;
}) {
    const counted = item.status.counted;

    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            disabled={!canCount}
            className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition active:scale-[0.99] ${
                counted
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 active:bg-slate-50'
            } ${!canCount ? 'cursor-default opacity-70' : ''}`}
        >
            <div className="flex items-start gap-3">
                {/* Indicador de status */}
                <div
                    className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        counted ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                />

                <div className="min-w-0 flex-1">
                    {/* Produto */}
                    <p className="truncate font-semibold text-blue-950">
                        {item.product.name}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        {item.stock.sector.name && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                {item.stock.sector.name}
                            </span>
                        )}
                        {item.product.sku && (
                            <span className="font-mono text-xs text-slate-400">
                                {item.product.sku}
                            </span>
                        )}
                    </div>

                    {/* Quantidades */}
                    <div className="mt-2.5 flex items-end justify-between">
                        <div>
                            <p className="text-xs text-slate-400">
                                {blindCount ? 'Contagem' : 'Sistema'}
                            </p>
                            {!blindCount && (
                                <p className="text-lg font-bold tabular-nums text-blue-950 leading-none">
                                    {item.count.system_quantity.toLocaleString('pt-BR', {
                                        maximumFractionDigits: 3,
                                    })}
                                    <span className="ml-1 text-xs font-normal text-slate-400">
                                        {item.product.unit ?? ''}
                                    </span>
                                </p>
                            )}
                        </div>

                        {counted && item.count.counted_quantity !== null && (
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Contado</p>
                                <p
                                    className={`text-lg font-bold tabular-nums leading-none ${
                                        item.status.needs_adjustment
                                            ? 'text-amber-600'
                                            : 'text-emerald-600'
                                    }`}
                                >
                                    {Number(item.count.counted_quantity).toLocaleString('pt-BR', {
                                        maximumFractionDigits: 3,
                                    })}
                                    <span className="ml-1 text-xs font-normal text-slate-400">
                                        {item.product.unit ?? ''}
                                    </span>
                                </p>
                            </div>
                        )}

                        {canCount && (
                            <svg
                                className="shrink-0 text-slate-300"
                                width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}

// ─── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: 'blue' | 'green' | 'amber';
}) {
    const styles = {
        blue:  'bg-blue-50 text-blue-950',
        green: 'bg-emerald-50 text-emerald-800',
        amber: 'bg-amber-50 text-amber-800',
    };
    const labelStyles = {
        blue:  'text-blue-500',
        green: 'text-emerald-600',
        amber: 'text-amber-600',
    };

    return (
        <div className={`rounded-xl px-3 py-2 text-center ${styles[color]}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wide ${labelStyles[color]}`}>
                {label}
            </p>
            <p className="mt-0.5 text-xl font-bold tabular-nums">{value}</p>
        </div>
    );
}