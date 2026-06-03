import { useEffect, useRef, FormEvent } from 'react';
import { X, MinusCircle, MapPin, Calendar, FileText, PackageOpen, AlertCircle } from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import { formatQuantity } from '@/utils/formatValues';

interface StockItem {
    id: number;
    project_name: string | null;
    sector: { name: string } | null;
    expires_at: string | null;
    invoice: { type: string; number: string };
    stock_quantity: number;
}

interface StockConsumeModalProps {
    productName: string;
    productUnit: string;
    stockItems: StockItem[];
    isOpen: boolean;
    onClose: () => void;
}

export function StockConsumeModal({
    productName,
    productUnit,
    stockItems,
    isOpen,
    onClose,
}: StockConsumeModalProps) {
    const firstInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, processing, reset } = useForm({
        consumptions: [] as Array<{ stock_id: number; quantity: string | number }>,
        notes: '',
    });

    // Reinitializes consumptions whenever stockItems changes
    useEffect(() => {
        setData(
            'consumptions',
            stockItems.map((item) => ({
                stock_id: item.id,
                quantity: '',
            })),
        );
    }, [stockItems]);

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => firstInputRef.current?.focus(), 80);
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleQuantityChange = (stockId: number, value: string) => {
        setData(
            'consumptions',
            data.consumptions.map((item) =>
                item.stock_id === stockId ? { ...item, quantity: value } : item,
            ),
        );
    };

    const totalToConsume = data.consumptions.reduce(
        (sum, item) => sum + (parseFloat(String(item.quantity)) || 0),
        0,
    );

    const hasValidationError = stockItems.some((item) => {
        const inputValue = data.consumptions.find((c) => c.stock_id === item.id)?.quantity || '';
        return (parseFloat(String(inputValue)) || 0) > item.stock_quantity;
    });

    // FIX: correct signature and invocation
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validConsumptions = data.consumptions
            .filter((item) => parseFloat(String(item.quantity)) > 0)
            .map((item) => ({
                stock_id: item.stock_id,
                quantity: parseFloat(String(item.quantity)),
            }));

        if (!validConsumptions.length || hasValidationError) return;

        router.post(
            route('admin.stock.consume'),
            {
                consumptions: validConsumptions,
                notes: data.notes,
            },
            {
                onFinish: () => {
                    reset();
                    onClose();
                },
            },
        );
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const isSubmitDisabled = processing || totalToConsume <= 0 || hasValidationError;

    return (
        /* Backdrop */
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consume-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal panel */}
            <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">

                {/* ── HEADER ─────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                            <MinusCircle size={18} className="text-red-500" />
                        </div>
                        <div>
                            <h2
                                id="consume-modal-title"
                                className="text-sm font-semibold text-neutral-800 leading-tight"
                            >
                                Registrar Baixa de Estoque
                            </h2>
                            <p className="mt-0.5 font-bold text-red-600 ">
                                {productName}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        aria-label="Fechar modal"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── BODY ───────────────────────────────────────────────────── */}
                {/* FIX: correct onSubmit invocation */}
                <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">

                    {stockItems.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-neutral-400">
                            <PackageOpen size={40} strokeWidth={1.25} />
                            <p className="text-sm font-medium">Nenhum lote disponível</p>
                        </div>
                    ) : (
                        /* Scrollable table */
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10 bg-neutral-50/90 backdrop-blur-sm border-b border-neutral-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                            Projeto
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                            Setor
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                            Validade
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                            Documento
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                            Disponível
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-400 w-36">
                                            Retirar ({productUnit})
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-neutral-100">
                                    {stockItems.map((item, idx) => {
                                        const inputValue =
                                            data.consumptions.find(
                                                (c) => c.stock_id === item.id,
                                            )?.quantity ?? '';

                                        const inputQty = parseFloat(String(inputValue)) || 0;
                                        const isInvalid = inputQty > item.stock_quantity;
                                        const hasValue = inputQty > 0;

                                        const isExpiringSoon =
                                            item.expires_at
                                                ? new Date(item.expires_at) <=
                                                  new Date(Date.now() + 30 * 86400000)
                                                : false;

                                        return (
                                            <tr
                                                key={item.id}
                                                className={`transition-colors ${
                                                    isInvalid
                                                        ? 'bg-red-50/60'
                                                        : hasValue
                                                        ? 'bg-amber-50/40'
                                                        : 'hover:bg-neutral-50/80'
                                                }`}
                                            >
                                                {/* Projeto */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin
                                                            size={11}
                                                            className="shrink-0 text-neutral-300"
                                                        />
                                                        <span className="text-neutral-700">
                                                            {item.project_name || (
                                                                <span className="text-neutral-300">—</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Setor */}
                                                <td className="px-4 py-3 text-neutral-600">
                                                    {item.sector?.name || (
                                                        <span className="text-neutral-300">—</span>
                                                    )}
                                                </td>

                                                {/* Validade */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar
                                                            size={11}
                                                            className={`shrink-0 ${
                                                                isExpiringSoon
                                                                    ? 'text-amber-400'
                                                                    : 'text-neutral-300'
                                                            }`}
                                                        />
                                                        {item.expires_at ? (
                                                            <span
                                                                className={
                                                                    isExpiringSoon
                                                                        ? 'font-medium text-amber-600'
                                                                        : 'text-neutral-600'
                                                                }
                                                            >
                                                                {item.expires_at}
                                                            </span>
                                                        ) : (
                                                            <span className="text-neutral-300">—</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Documento */}
                                                <td className="px-4 py-3 text-right">
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                                        <FileText size={10} />
                                                        {`${item.invoice.type}-${item.invoice.number}`}
                                                    </span>
                                                </td>

                                                {/* Disponível */}
                                                <td className="px-4 py-3 text-right">
                                                    <span className="font-semibold tabular-nums text-neutral-800">
                                                        {formatQuantity(item.stock_quantity)}
                                                    </span>
                                                </td>

                                                {/* Input de retirada */}
                                                <td className="px-4 py-3">
                                                    <div className="relative">
                                                        <input
                                                            ref={idx === 0 ? firstInputRef : undefined}
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max={item.stock_quantity}
                                                            value={inputValue}
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            aria-label={`Quantidade a retirar do lote ${item.invoice.type}-${item.invoice.number}`}
                                                            aria-invalid={isInvalid}
                                                            placeholder="0.000"
                                                            className={`w-full rounded-lg border bg-white px-3 py-1.5 text-right text-sm tabular-nums shadow-sm outline-none transition-all
                                                                placeholder:text-neutral-300
                                                                focus:ring-2 focus:ring-offset-0
                                                                ${
                                                                    isInvalid
                                                                        ? 'border-red-400 text-red-600 focus:border-red-400 focus:ring-red-200'
                                                                        : hasValue
                                                                        ? 'border-amber-400 text-amber-700 focus:border-amber-400 focus:ring-amber-100'
                                                                        : 'border-neutral-200 text-neutral-800 focus:border-blue-400 focus:ring-blue-100'
                                                                }`}
                                                        />
                                                        {isInvalid && (
                                                            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                                                                <AlertCircle
                                                                    size={13}
                                                                    className="text-red-400"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isInvalid && (
                                                        <p className="mt-1 text-right text-[10px] font-medium text-red-500">
                                                            Máx. {item.stock_quantity.toFixed(3)}
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── FOOTER ─────────────────────────────────────────────── */}
                    <div className="border-t border-neutral-100 bg-neutral-50/60 px-6 py-4 space-y-3">

                        {/* Summary bar */}
                        {totalToConsume > 0 && (
                            <div
                                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                                    hasValidationError
                                        ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                                        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                                }`}
                            >
                                <span className="text-xs uppercase tracking-wide font-semibold opacity-70">
                                    Total a retirar
                                </span>
                                <span className="tabular-nums">
                                    {formatQuantity(totalToConsume)}{' '}
                                    <span className="font-normal opacity-70">{productUnit}</span>
                                </span>
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label
                                htmlFor="consume-notes"
                                className="mb-1.5 block text-xs font-semibold text-neutral-500"
                            >
                                Observação <span className="font-normal opacity-60">(opcional)</span>
                            </label>
                            <textarea
                                id="consume-notes"
                                rows={2}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Descreva o motivo da baixa..."
                                className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm outline-none transition-all placeholder:text-neutral-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2.5">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-600 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                className="flex-[2] rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Salvando…
                                    </span>
                                ) : (
                                    'Confirmar Baixa'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}