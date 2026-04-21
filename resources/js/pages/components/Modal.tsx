import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

type Props = {
    open: boolean;
    onClose: () => void;

    title?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;

    size?: ModalSize;
    showCloseButton?: boolean;
    closeOnOverlay?: boolean;
};

const sizeMap: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-3xl',
};

export default function Modal({
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    showCloseButton = true,
    closeOnOverlay = true,
}: Props) {

    // 🔥 ESC para fechar
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }

        if (open) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [open]);

    // 🔥 trava scroll do body
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [open]);

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeOnOverlay ? onClose : undefined}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={`relative w-full ${sizeMap[size]} rounded-2xl bg-white shadow-xl flex flex-col`}
                    >

                        {/* HEADER */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between border-b px-6 py-4">

                                <div className="text-lg font-semibold text-slate-800">
                                    {title}
                                </div>

                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="text-slate-400 hover:text-slate-600 transition"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        )}

                        {/* BODY */}
                        <div className="px-6 py-5 flex-1 overflow-y-auto max-h-[70vh]">
                            {children}
                        </div>

                        {/* FOOTER */}
                        {footer && (
                            <div className="border-t px-6 py-4 bg-slate-50 rounded-b-2xl">
                                {footer}
                            </div>
                        )}

                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}