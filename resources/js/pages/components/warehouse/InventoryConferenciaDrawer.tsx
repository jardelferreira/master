import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

import { InventoryItem } from '@/pages/warehouse/inventories/InventoryConferencia';

// ─── Types ───────────────────────────────────────────────────────────────────

type Statistics = {
    total: number;
    counted: number;
    pending: number;
    adjustments: number;
};

type Props = {
    open: boolean;
    item: InventoryItem | null;
    inventoryId: number;
    blindCount: boolean;
    canCount: boolean;
    onClose: () => void;
    onItemUpdated: (item: InventoryItem, stats: Statistics) => void;
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function InventoryConferenciaDrawer({
    open,
    item,
    inventoryId,
    blindCount,
    canCount,
    onClose,
    onItemUpdated,
}: Props) {
    // Fecha ao pressionar ESC
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Trava scroll da página
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

                    {/* ── Desktop: side panel ───────────────────────────── */}
                    <motion.aside
                        key="panel-desktop"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 z-50 hidden h-full w-full max-w-md flex-col bg-white shadow-2xl md:flex"
                    >
                        <DrawerContent
                            item={item}
                            inventoryId={inventoryId}
                            blindCount={blindCount}
                            canCount={canCount}
                            onClose={onClose}
                            onItemUpdated={onItemUpdated}
                        />
                    </motion.aside>

                    {/* ── Mobile: bottom sheet ──────────────────────────── */}
                    <motion.div
                        key="sheet-mobile"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 flex h-[92dvh] flex-col rounded-t-3xl bg-white shadow-2xl md:hidden"
                    >
                        {/* Handle */}
                        <div className="flex shrink-0 justify-center pb-1 pt-3">
                            <div className="h-1 w-10 rounded-full bg-slate-200" />
                        </div>

                        <DrawerContent
                            item={item}
                            inventoryId={inventoryId}
                            blindCount={blindCount}
                            canCount={canCount}
                            onClose={onClose}
                            onItemUpdated={onItemUpdated}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body,
    );
}

// ─── Inner content ────────────────────────────────────────────────────────────

function DrawerContent({
    item,
    inventoryId,
    blindCount,
    canCount,
    onClose,
    onItemUpdated,
}: {
    item: InventoryItem;
    inventoryId: number;
    blindCount: boolean;
    canCount: boolean;
    onClose: () => void;
    onItemUpdated: (item: InventoryItem, stats: Statistics) => void;
}) {
    const [quantity, setQuantity] = useState<string>(
        item.count.counted_quantity !== null
            ? String(item.count.counted_quantity)
            : '',
    );
    const [notes, setNotes]       = useState(item.count.notes ?? '');
    const [saving, setSaving]     = useState(false);
    const [error, setError]       = useState<string | null>(null);
    const [success, setSuccess]   = useState(false);
    const inputRef                = useRef<HTMLInputElement>(null);

    // Sincroniza estado quando o item muda (troca de item sem fechar o drawer)
    useEffect(() => {
        setQuantity(
            item.count.counted_quantity !== null
                ? String(item.count.counted_quantity)
                : '',
        );
        setNotes(item.count.notes ?? '');
        setError(null);
        setSuccess(false);
    }, [item.id]);

    // Foca o input ao abrir
    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 350);
        return () => clearTimeout(timer);
    }, [item.id]);

    const difference = (() => {
        const qty = parseFloat(quantity);
        if (isNaN(qty)) return null;
        return qty - item.count.system_quantity;
    })();

    async function handleSubmit() {
        const qty = parseFloat(quantity);
        if (isNaN(qty) || qty < 0) {
            setError('Informe uma quantidade válida.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const res = await axios.put(
                route('warehouse.inventories.items.update', item.id),
                {
                    counted_quantity: qty,
                    notes: notes || null,
                },
            );

            setSuccess(true);
            onItemUpdated(res.data.item, res.data.statistics);

            // Fecha o drawer automaticamente após 800ms
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 800);
        } catch {
            setError('Erro ao salvar. Tente novamente.');
        } finally {
            setSaving(false);
        }
    }

    const alreadyCounted = item.status.counted;

    return (
        <>
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4">
                <div className="min-w-0 pr-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                        Conferência
                    </p>
                    <h2 className="mt-0.5 text-lg font-bold leading-tight text-blue-950">
                        {item.product.name}
                    </h2>
                    {item.product.sku && (
                        <p className="mt-0.5 font-mono text-xs text-slate-400">
                            {item.product.sku}
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

            {/* ── Body scrollável ───────────────────────────────────────── */}
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">

                {/* Info cards */}
                <div className="grid grid-cols-2 gap-3">
                    {item.stock.sector.name && (
                        <InfoCard label="Setor">
                            <span className="text-sm font-semibold text-slate-700">
                                {item.stock.sector.name}
                            </span>
                        </InfoCard>
                    )}

                    {item.product.category && (
                        <InfoCard label="Categoria">
                            <span className="text-sm font-semibold text-slate-700">
                                {item.product.category}
                            </span>
                        </InfoCard>
                    )}

                    {!blindCount && (
                        <InfoCard label="Qtd. no sistema">
                            <span className="text-xl font-bold tabular-nums text-blue-950">
                                {item.count.system_quantity.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 3,
                                })}
                                {item.product.unit && (
                                    <span className="ml-1 text-xs font-normal text-slate-400">
                                        {item.product.unit}
                                    </span>
                                )}
                            </span>
                        </InfoCard>
                    )}

                    {alreadyCounted && (
                        <InfoCard label="Última contagem">
                            <span className="text-sm font-semibold text-emerald-700">
                                {Number(item.count.counted_quantity).toLocaleString('pt-BR', {
                                    maximumFractionDigits: 3,
                                })}{' '}
                                {item.product.unit ?? ''}
                            </span>
                            {item.count.operator.name && (
                                <p className="mt-0.5 text-xs text-slate-400">
                                    por {item.count.operator.name}
                                </p>
                            )}
                        </InfoCard>
                    )}
                </div>

                {/* Aviso de inventário cego */}
                {blindCount && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                        🔒 Inventário cego — a quantidade do sistema não é exibida durante a contagem.
                    </div>
                )}

                {/* Campo de quantidade */}
                {canCount && (
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Quantidade contada{' '}
                            {item.product.unit && (
                                <span className="font-normal text-slate-400">
                                    ({item.product.unit})
                                </span>
                            )}
                        </label>

                        <input
                            ref={inputRef}
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.001"
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value);
                                setError(null);
                            }}
                            placeholder="0"
                            className={`w-full rounded-2xl border px-4 py-4 text-center text-3xl font-bold tabular-nums text-blue-950 outline-none transition focus:ring-2 ${
                                error
                                    ? 'border-red-300 bg-red-50 focus:ring-red-200'
                                    : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:bg-white focus:ring-blue-100'
                            }`}
                        />

                        {/* Preview da diferença */}
                        {!blindCount && difference !== null && (
                            <div
                                className={`mt-2 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold ${
                                    difference === 0
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : difference > 0
                                          ? 'bg-blue-50 text-blue-700'
                                          : 'bg-red-50 text-red-700'
                                }`}
                            >
                                {difference === 0 ? (
                                    <>
                                        <CheckCircle2 size={15} />
                                        Sem diferença
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={15} />
                                        Diferença:{' '}
                                        {difference > 0 ? '+' : ''}
                                        {difference.toLocaleString('pt-BR', {
                                            maximumFractionDigits: 3,
                                        })}{' '}
                                        {item.product.unit ?? ''}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Observação */}
                {canCount && (
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Observação{' '}
                            <span className="font-normal text-slate-400">(opcional)</span>
                        </label>
                        <textarea
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Alguma observação sobre a contagem..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white transition"
                        />
                    </div>
                )}

                {/* Erro */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Readonly: contagem já registrada e não pode alterar */}
                {!canCount && alreadyCounted && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Este inventário não permite mais alterações.
                    </div>
                )}
            </div>

            {/* ── Footer: botão confirmar ───────────────────────────────── */}
            {canCount && (
                <div className="shrink-0 border-t border-slate-100 px-5 py-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving || quantity === '' || success}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition ${
                            success
                                ? 'bg-emerald-500 text-white'
                                : saving
                                  ? 'bg-blue-400 text-white'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {success ? (
                            <>
                                <CheckCircle2 size={20} />
                                Salvo!
                            </>
                        ) : saving ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Salvando...
                            </>
                        ) : alreadyCounted ? (
                            'Atualizar contagem'
                        ) : (
                            'Confirmar contagem'
                        )}
                    </button>
                </div>
            )}
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
            <p className="mb-1 text-xs text-slate-400">{label}</p>
            <div>{children}</div>
        </div>
    );
}