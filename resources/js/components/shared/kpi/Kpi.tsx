import { ReactNode } from 'react';
import clsx from 'clsx';

interface KPIProps {
    title: string;
    value: ReactNode;

    icon?: ReactNode;

    description?: ReactNode;

    className?: string;

    valueClassName?: string;

    iconClassName?: string;
}

export default function KPI({
    title,
    value,
    icon,
    description,
    className,
    valueClassName,
    iconClassName,
}: KPIProps) {
    return (
        <div
            className={clsx(
                'rounded-2xl border border-base-200 bg-white p-5 shadow-sm',
                className,
            )}
        >
            <div className="flex items-start justify-between gap-4">

                <div className="space-y-1">

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h3
                        className={clsx(
                            'text-3xl font-bold tracking-tight text-slate-900',
                            valueClassName,
                        )}
                    >
                        {value}
                    </h3>

                    {description && (
                        <p className="text-xs text-slate-500">
                            {description}
                        </p>
                    )}

                </div>

                {icon && (
                    <div
                        className={clsx(
                            'flex h-11 w-11 items-center justify-center rounded-xl bg-core-50 text-core-600',
                            iconClassName,
                        )}
                    >
                        {icon}
                    </div>
                )}

            </div>
        </div>
    );
}

