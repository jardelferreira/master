import {
    Fragment,
    ReactNode,
    useEffect,
} from 'react';

import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface ModalProps {
    isOpen: boolean;

    children: ReactNode;

    onClose: () => void;

    closeOnBackdrop?: boolean;

    closeOnEscape?: boolean;

    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
}

const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '4xl': 'max-w-6xl',
    '6xl': 'max-w-7xl',
};

export default function Modal({
    isOpen,
    children,
    onClose,
    size = 'lg',
    closeOnBackdrop = true,
    closeOnEscape = true,
}: ModalProps) {
    useEffect(() => {
        if (!isOpen || !closeOnEscape) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeOnEscape, onClose]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <Fragment>

            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
                onClick={() => {
                    if (closeOnBackdrop) {
                        onClose();
                    }
                }}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">

                <div
                    className={clsx(
                        'flex max-h-[95vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl',
                        sizes[size],
                    )}
                    onClick={(event) => event.stopPropagation()}
                >
                    {children}
                </div>

            </div>

        </Fragment>,
        document.body,
    );
}