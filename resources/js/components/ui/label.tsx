import * as React from 'react';
import clsx from 'clsx';

export interface LabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export default function Label({
    children,
    required = false,
    className,
    ...props
}: LabelProps) {
    return (
        <label
            className={clsx(
                'mb-2 inline-flex items-center gap-1 text-sm font-medium text-base-700',
                className,
            )}
            {...props}
        >
            {children}

            {required && (
                <span className="text-red-500">*</span>
            )}
        </label>
    );
}