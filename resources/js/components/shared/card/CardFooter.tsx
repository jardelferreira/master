import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export default function CardFooter({
    children,
    className,
}: CardFooterProps) {
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