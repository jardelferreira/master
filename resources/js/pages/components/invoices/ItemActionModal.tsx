import { Alert } from "@/lib/alert";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    routeName: string;
    itemId: number | null;
    title: string;
    quantity: number;           // era Big — agora float direto do backend
    onSubmit?: (itemId: number) => void;   // chamado ANTES do post (seta loadingItemId)
    onFinish?: () => void;                 // chamado quando o request termina (limpa loading)
};

export default function ItemActionModal({
    open,
    onClose,
    routeName,
    itemId,
    title,
    quantity,
    onSubmit,
    onFinish,
}: Props) {
    const { data, setData, post, processing, reset } = useForm({
        quantity: quantity.toFixed(2),
    });

    useEffect(() => {
        if (open) {
            setData("quantity", quantity.toFixed(2));
        } else {
            reset();
        }
    }, [open, quantity]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!itemId) return;

        const entered = parseFloat(data.quantity);

        if (isNaN(entered) || entered <= 0) {
            Alert("Erro!", "Informe uma quantidade válida.", "error");
            return;
        }

        if (entered > quantity) {
            Alert("Erro!", "Quantidade excede o permitido.", "error");
            return;
        }

        // Avisa o pai que o request vai começar (pai seta loadingItemId)
        onSubmit?.(itemId);

        post(route(routeName, itemId), {
            onSuccess: () => {
                onClose();
            },
            onFinish: () => {
                // Avisa o pai que terminou, com sucesso ou erro (pai limpa loading)
                onFinish?.();
            },
        });
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
                <h2 className="text-lg font-semibold text-zinc-800">{title}</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={quantity.toFixed(2)}
                            placeholder="Quantidade"
                            value={data.quantity}
                            onChange={(e) => setData("quantity", e.target.value)}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-xs text-zinc-400">
                            Máx: {quantity.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="px-3 py-2 text-sm border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            {processing && (
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            )}
                            {processing ? "Enviando..." : "Confirmar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}