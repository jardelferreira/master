import { ConfirmModalProps } from '@/types/modal';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function ConfirmModal({
    open,
    title = 'Confirmar ação',
    description = 'Tem certeza que deseja continuar?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant,
    loading,
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    if (!open) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const confirmButtonClass =
        variant === 'destructive'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-core-600 hover:bg-core-700';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-base-800">{title}</h2>

                <p className="mt-2 text-sm text-base-600">{description}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={clsx(
                            'flex min-w-28 items-center justify-center rounded-md px-4 py-2 text-sm text-white transition',
                            confirmButtonClass,
                            loading && 'cursor-not-allowed opacity-70',
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
