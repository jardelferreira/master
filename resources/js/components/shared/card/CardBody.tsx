import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

export default function CardBody({
    children,
    className,
}: CardBodyProps) {
    return (
        <div
            className={clsx(
                'p-6',
                className,
            )}
        >
            {children}
        </div>
    );
}