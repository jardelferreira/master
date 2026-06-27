import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({
    children,
    className,
}: CardProps) {
    return (
        <div
            className={clsx(
                'overflow-hidden rounded-2xl border border-base-200 bg-white shadow-sm',
                className,
            )}
        >
            {children}
        </div>
    );
}