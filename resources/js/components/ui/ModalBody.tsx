import { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
    children: ReactNode;

    className?: string;
}

export default function ModalBody({
    children,
    className,
}: Props) {
    
    return (
        <div
            className={clsx(
                'flex-1 overflow-y-auto p-6',
                className,
            )}
        >
            {children}
        </div>
    );
}