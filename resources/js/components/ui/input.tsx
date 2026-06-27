import * as React from 'react';
import clsx from 'clsx';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', ...props }, ref) => {
        return (
            <input
                ref={ref}
                type={type}
                className={clsx(
                    'flex h-10 w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-sm',
                    'placeholder:text-base-400',
                    'focus:border-core-500 focus:outline-none focus:ring-2 focus:ring-core-200',
                    'disabled:cursor-not-allowed disabled:bg-base-100 disabled:text-base-500',
                    'transition-colors',
                    className,
                )}
                {...props}
            />
        );
    },
);

Input.displayName = 'Input';

export default Input;