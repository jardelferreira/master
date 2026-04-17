import { ReactNode } from 'react';
import { ModalProps } from '@/types/modal';

export default function Modal({ open, title, children, onClose }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-xl bg-white shadow-lg">
                {title && (
                    <div className="border-b border-base-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-base-800">
                            {title}
                        </h2>
                    </div>
                )}

                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}
