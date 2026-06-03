import { useEffect } from 'react';
import { X, ArrowDownCircle, Package, FileText } from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import { formatQuantity } from '@/utils/formatValues';

type PendingItem = {
    id: number;
    uuid: string;
    product: {
        id: number;
        name: string;
        unit: string | null;
    };
    invoice: {
        id: number;
        number: string;
        provider_name: string;
    };
    quantity: number;
    approved_quantity: number;
    entered_quantity: number;
    pending_quantity: number;
};

type EntryItem = {
    invoice_item_id: number;
    quantity: string;
};

type Props = {
    items: PendingItem[];
    isOpen: boolean;
    onClose: () => void;
};

export function StockEntryModal({ items, isOpen, onClose }: Props) {
    const { data, setData, processing, errors, reset } = useForm<{
        items: EntryItem[];
        notes: string;
    }>({
        items: [],
        notes: '',
    });

    // Inicializa items quando o modal abre
    useEffect(() => {
        if (isOpen && items.length > 0) {
            setData(
                'items',
                items.map((item) => ({
                    invoice_item_id: item.id,
                    quantity: item.pending_quantity.toFixed(2),
                })),
            );
        }
    }, [isOpen, items]);

    if (!isOpen) return null;

    const handleQuantityChange = (invoiceItemId: number, value: string) => {
        setData(
            'items',
            data.items.map((item) =>
                item.invoice_item_id === invoiceItemId
                    ? { ...item, quantity: value }
                    : item,
            ),
        );
    };

    const getTotalToEnter = () => {
        return data.items.reduce((sum, item) => {
            return sum + (parseFloat(item.quantity) || 0);
        }, 0);
    };

    const getItemInfo = (invoiceItemId: number) => {
        return items.find((i) => i.id === invoiceItemId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validItems = data.items
            .filter((item) => parseFloat(item.quantity) > 0)
            .map((item) => ({
                invoice_item_id: item.invoice_item_id,
                quantity: parseFloat(item.quantity),
            }));

        if (validItems.length === 0) {
            return;
        }

        router.post(
            route('admin.stock.entries'),
            {
                items: validItems,
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

    const totalToEnter = getTotalToEnter();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleClose}
            />

            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <div className="mb-1 flex items-center gap-2">
                        <ArrowDownCircle
                            size={20}
                            className="text-emerald-600"
                        />
                        <h2 className="text-lg font-semibold text-neutral-900">
                            Receber Items no Estoque
                        </h2>
                    </div>
                    <p className="text-sm text-neutral-500">
                        Informe a quantidade a receber para cada item.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="overflow-hidden rounded-lg border border-neutral-200">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                                        Produto
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-neutral-600">
                                        Nota Fiscal
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium text-neutral-600">
                                        Pendente
                                    </th>
                                    <th className="w-32 px-3 py-2 text-right font-medium text-neutral-600">
                                        Receber
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {data.items.map((entry) => {
                                    const itemInfo = getItemInfo(
                                        entry.invoice_item_id,
                                    );
                                    if (!itemInfo) return null;

                                    const inputQty =
                                        parseFloat(entry.quantity) || 0;
                                    const maxQty = itemInfo.pending_quantity;
                                    const isInvalid = inputQty > maxQty;

                                    return (
                                        <tr
                                            key={entry.invoice_item_id}
                                            className="hover:bg-neutral-50"
                                        >
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-1.5">
                                                    <Package
                                                        size={12}
                                                        className="text-neutral-400"
                                                    />
                                                    <span className="text-neutral-700">
                                                        {itemInfo.product.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex flex-col">
                                                    <span className="flex items-center gap-1 text-xs text-neutral-600">
                                                        <FileText size={10} />
                                                        {
                                                            itemInfo.invoice
                                                                .number
                                                        }
                                                    </span>
                                                    <span className="text-xs text-neutral-400">
                                                        {
                                                            itemInfo.invoice
                                                                .provider_name
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <span className="font-medium text-amber-600 tabular-nums">
                                                    {formatQuantity(maxQty)}{' '}
                                                    <span className="text-xs text-neutral-400">
                                                        {itemInfo.product.unit}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="number"
                                                    step="1"
                                                    min="0"
                                                    max={maxQty}
                                                    value={entry.quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            entry.invoice_item_id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`w-full rounded-lg border px-2 py-1.5 text-right text-sm tabular-nums focus:ring-1 focus:outline-none ${
                                                        isInvalid
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                            : 'border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500'
                                                    }`}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {totalToEnter > 0 && (
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                            <p className="text-sm text-emerald-700">
                                Total a receber:{' '}
                                <span className="font-semibold">
                                    {formatQuantity(totalToEnter)}{' '}
                                    {items[0]?.product.unit}
                                </span>
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700">
                            Observações
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            rows={2}
                            placeholder="Opcional..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing || totalToEnter <= 0}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Salvando...' : 'Receber Items'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
