import { ReactNode } from 'react';

import Card from '../card/Card';

interface Item {
    label: string;
    value?: ReactNode;
}

interface Props {
    title?: string;
    items: Item[];
}

import InfoRow from './InfoRow';

export default function InfoList({
    title,
    items,
}: Props) {
    return (
        <Card>

            {title && (
                <div className="border-b border-base-200 px-6 py-4">

                    <h2 className="font-semibold text-slate-900">
                        {title}
                    </h2>

                </div>
            )}

            <div className="px-6 py-3">

                {items.map((item) => (
                    <InfoRow
                        key={item.label}
                        label={item.label}
                        value={item.value}
                    />
                ))}

            </div>

        </Card>
    );
}