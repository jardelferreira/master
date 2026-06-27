import { ReactNode } from 'react';
import clsx from 'clsx';

interface KPIGridProps {
    children: ReactNode;

    className?: string;

    columns?: 2 | 3 | 4;
}

const columnsMap = {
    2: 'md:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'xl:grid-cols-4',
};

export default function KPIGrid({
    children,
    columns = 4,
    className,
}: KPIGridProps) {
    return (
        <div
            className={clsx(
                'grid gap-5',
                columnsMap[columns],
                className,
            )}
        >
            {children}
        </div>
    );
}