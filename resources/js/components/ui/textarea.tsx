import * as React from 'react';
import clsx from 'clsx';

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, rows = 4, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                rows={rows}
                className={clsx(
                    'flex min-h-[100px] w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-sm',
                    'placeholder:text-base-400',
                    'focus:border-core-500 focus:outline-none focus:ring-2 focus:ring-core-200',
                    'disabled:cursor-not-allowed disabled:bg-base-100 disabled:text-base-500',
                    'resize-y transition-colors',
                    className,
                )}
                {...props}
            />
        );
    },
);

Textarea.displayName = 'Textarea';

export default Textarea;