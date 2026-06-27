import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
    title?: ReactNode;

    onClose?: () => void;

    children?: ReactNode;
}

export default function ModalHeader({
    title,
    onClose,
    children,
}: Props) {
    return (
        <div className="flex items-center justify-between border-b border-base-200 px-6 py-4">

            <div>

                {title && (
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>
                )}

                {children}

            </div>

            {onClose && (

                <button
                    onClick={onClose}
                    className="rounded-md p-2 transition hover:bg-base-100"
                >
                    <X className="h-5 w-5" />
                </button>

            )}

        </div>
    );
}