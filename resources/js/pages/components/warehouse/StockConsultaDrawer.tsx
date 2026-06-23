import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { X, TrendingDown, TrendingUp, Minus } from 'lucide-react';

import { StockItem, StatusBadge } from '@/pages/warehouse/StockConsulta';

// ─── Types ───────────────────────────────────────────────────────────────────

type Movement = {
    id: number;
    type: string;
    type_label: string;
    direction: 'in' | 'out';
    quantity: number;
    balance_after: number | null;
    performed_at: string | null;
    notes: string | null;
    sector: string | null;
    user: string | null;
    employee: string | null;
    team: string | null;
};

type Props = {
    open: boolean;
    item: StockItem | null;
    projectId: number;
    onClose: () => void;
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function StockConsultaDrawer({
    open,
    item,
    projectId,
    onClose,
}: Props) {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState(false);

    // Carrega histórico ao abrir
    useEffect(() => {
        if (!open || !item) return;

        setMovements([]);
        setError(false);
        setLoading(true);

        axios
            .get(
                route('warehouse.projects.consulta.movements', {
                    project:   projectId,
                    productId: item.product_id,
                }),
            )
            .then((res) => setMovements(res.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [open, item?.product_id, projectId]);

    // Fecha ao pressionar ESC
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Trava scroll
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {open && item && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/*
                     * Em mobile → bottom sheet deslizando de baixo para cima
                     * Em desktop → painel lateral deslizando da direita
                     */}

                    {/* ── Desktop: side panel ───────────────────────────── */}
                    <motion.aside
                        key="panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="
                            fixed right-0 top-0 z-50
                            hidden md:flex
                            h-full w-full max-w-md
                            flex-col bg-white shadow-2xl
                        "
                    >
                        <DrawerContent
                            item={item}
                            movements={movements}
                            loading={loading}
                            error={error}
                            onClose={onClose}
                        />
                    </motion.aside>

                    {/* ── Mobile: bottom sheet ──────────────────────────── */}
                    <motion.div
                        key="sheet"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="
                            fixed bottom-0 left-0 right-0 z-50
                            flex md:hidden
                            h-[90dvh] flex-col
                            rounded-t-3xl bg-white shadow-2xl
                        "
                    >
                        {/* Handle visual */}
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="h-1 w-10 rounded-full bg-slate-200" />
                        </div>

                        <DrawerContent
                            item={item}
                            movements={movements}
                            loading={loading}
                            error={error}
                            onClose={onClose}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body,
    );
}

// ─── Inner content (shared between panel and sheet) ──────────────────────────

function DrawerContent({
    item,
    movements,
    loading,
    error,
    onClose,
}: {
    item: StockItem;
    movements: Movement[];
    loading: boolean;
    error: boolean;
    onClose: () => void;
}) {
    return (
        <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 shrink-0">
                <div className="min-w-0 pr-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                        Detalhes do produto
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-blue-950 leading-tight">
                        {item.product_name}
                    </h2>
                    {item.product_sku && (
                        <p className="mt-0.5 text-xs text-slate-400">
                            SKU: {item.product_sku}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                {/* ── Info cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3">
                    <InfoCard label="Saldo atual">
                        <span className="text-2xl font-bold text-blue-950 tabular-nums">
                            {item.total_quantity.toLocaleString('pt-BR', {
                                maximumFractionDigits: 3,
                            })}
                        </span>
                        {item.product_unit && (
                            <span className="ml-1 text-sm font-normal text-slate-500">
                                {item.product_unit}
                            </span>
                        )}
                    </InfoCard>

                    <InfoCard label="Status">
                        <StatusBadge status={item.status} />
                    </InfoCard>

                    {item.sector_name && (
                        <InfoCard label="Setor">
                            <span className="text-sm font-semibold text-slate-700">
                                {item.sector_name}
                            </span>
                        </InfoCard>
                    )}

                    {item.min_quantity !== null && (
                        <InfoCard label="Estoque mínimo">
                            <span className="text-sm font-semibold text-slate-700 tabular-nums">
                                {item.min_quantity}{' '}
                                {item.product_unit ?? ''}
                            </span>
                        </InfoCard>
                    )}

                    {item.product_unit && (
                        <InfoCard label="Unidade">
                            <span className="text-sm font-semibold text-slate-700 uppercase">
                                {item.product_unit}
                            </span>
                        </InfoCard>
                    )}
                </div>

                {/* Alerta de estoque crítico / zerado */}
                {item.status !== 'ok' && (
                    <div
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                            item.status === 'empty'
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                    >
                        {item.status === 'empty'
                            ? '⚠️ Estoque zerado — reposição necessária.'
                            : `⚠️ Estoque abaixo do mínimo (${item.min_quantity} ${item.product_unit ?? ''}).`}
                    </div>
                )}

                {/* ── Histórico ──────────────────────────────────────────── */}
                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Últimas movimentações
                    </p>

                    {loading && (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-16 animate-pulse rounded-2xl bg-slate-100"
                                />
                            ))}
                        </div>
                    )}

                    {error && !loading && (
                        <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-6 text-center">
                            <p className="text-sm text-red-600">
                                Erro ao carregar histórico.
                            </p>
                        </div>
                    )}

                    {!loading && !error && movements.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                            <p className="text-sm text-slate-400">
                                Nenhuma movimentação registrada.
                            </p>
                        </div>
                    )}

                    {!loading && !error && movements.length > 0 && (
                        <div className="space-y-2">
                            {movements.map((m) => (
                                <MovementRow key={m.id} movement={m} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Info card ───────────────────────────────────────────────────────────────

function InfoCard({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-xs text-slate-500">{label}</p>
            <div>{children}</div>
        </div>
    );
}

// ─── Linha de movimentação ────────────────────────────────────────────────────

function MovementRow({ movement: m }: { movement: Movement }) {
    const isIn = m.direction === 'in';

    const Icon = isIn ? TrendingUp : TrendingDown;

    const iconClass = isIn
        ? 'text-emerald-600 bg-emerald-50'
        : 'text-red-500 bg-red-50';

    const qtyClass = isIn
        ? 'text-emerald-700'
        : 'text-red-600';

    return (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3">
            {/* Ícone direcional */}
            <div className={`mt-0.5 shrink-0 rounded-xl p-2 ${iconClass}`}>
                <Icon size={14} />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {m.type_label}
                    </span>

                    <span className={`text-sm font-bold tabular-nums ${qtyClass}`}>
                        {isIn ? '+' : '-'}{m.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 3 })}
                    </span>
                </div>

                {/* Meta */}
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                    {m.performed_at && (
                        <span>{formatDate(m.performed_at)}</span>
                    )}
                    {m.sector && (
                        <span>📍 {m.sector}</span>
                    )}
                    {m.employee && (
                        <span>👤 {m.employee}</span>
                    )}
                    {m.team && (
                        <span>👥 {m.team}</span>
                    )}
                    {m.user && (
                        <span>🖥 {m.user}</span>
                    )}
                </div>

                {m.balance_after !== null && (
                    <p className="mt-1 text-xs text-slate-400">
                        Saldo após:{' '}
                        <span className="font-semibold text-slate-600">
                            {m.balance_after.toLocaleString('pt-BR', { maximumFractionDigits: 3 })}
                        </span>
                    </p>
                )}

                {m.notes && (
                    <p className="mt-1.5 rounded-xl bg-slate-50 px-2 py-1 text-xs italic text-slate-500">
                        "{m.notes}"
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(iso));
}