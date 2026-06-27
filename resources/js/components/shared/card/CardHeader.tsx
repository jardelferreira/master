import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export default function CardHeader({
    children,
    className,
}: CardHeaderProps) {
    return (
        <div
            className={clsx(
                'flex items-center justify-between border-b border-base-200 px-6 py-4',
                className,
            )}
        >
            {children}
        </div>
    );
}