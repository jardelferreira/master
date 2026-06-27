import { ReactNode } from 'react';
import clsx from 'clsx';

import Label from './label';

interface FormFieldProps {
    label?: ReactNode;

    description?: ReactNode;

    error?: ReactNode;

    required?: boolean;

    className?: string;

    children: ReactNode;
}

export default function FormField({
    label,
    description,
    error,
    required = false,
    className,
    children,
}: FormFieldProps) {
    return (
        <div
            className={clsx(
                'space-y-2',
                className,
            )}
        >
            {label && (
                <Label required={required}>
                    {label}
                </Label>
            )}

            {children}

            {description && !error && (
                <p className="text-xs text-base-500">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-sm font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}