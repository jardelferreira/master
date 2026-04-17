import { ConfirmModalProps } from '@/types/modal';

export default function ConfirmModal({
    open,
    title = 'Confirmar ação',
    description = 'Tem certeza que deseja continuar?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    if (!open) return null;

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
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
