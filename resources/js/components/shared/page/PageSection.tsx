import { ReactNode } from 'react';
import clsx from 'clsx';

interface PageSectionProps {
    title?: ReactNode;

    description?: ReactNode;

    children: ReactNode;

    actions?: ReactNode;

    className?: string;
}

export default function PageSection({
    title,
    description,
    actions,
    children,
    className,
}: PageSectionProps) {
    return (
        <section className={clsx('space-y-5', className)}>
            {(title || actions) && (
                <div className="flex items-start justify-between gap-4">
                    <div>
                        {title && (
                            <h2 className="text-lg font-semibold text-slate-900">
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p className="mt-1 text-sm text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>

                    {actions && (
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            {children}
        </section>
    );
}