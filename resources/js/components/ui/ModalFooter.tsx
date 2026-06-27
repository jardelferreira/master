import { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
    children: ReactNode;

    className?: string;
}

export default function ModalFooter({
    children,
    className,
}: Props) {
    return (
        <div
            className={clsx(
                'border-t border-base-200 px-6 py-4',
                className,
            )}
        >
            {children}
        </div>
    );
}