import { ReactNode } from 'react';

import Card from './Card';

interface Props {
    title: string;
    value: string | number;
    icon?: ReactNode;
}

export default function MetricCard({
    title,
    value,
    icon,
}: Props) {
    return (
        <Card className="p-5">

            <div className="flex items-center justify-between">

                <span className="text-sm font-medium text-slate-500">
                    {title}
                </span>

                {icon && (
                    <div className="text-core-600">
                        {icon}
                    </div>
                )}

            </div>

            <div className="mt-3 text-3xl font-bold text-slate-900">
                {value}
            </div>

        </Card>
    );
}