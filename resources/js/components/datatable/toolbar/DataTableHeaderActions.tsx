import { Link } from '@inertiajs/react';

import { Can } from '@/components/auth/Can';

import { DataTableHeaderAction } from '../types';

interface Props {

    actions?: DataTableHeaderAction[];

}

export function DataTableHeaderActions({
    actions,
}: Props) {

    if (!actions?.length) {
        return null;
    }

    return (

        <>

            {actions.map((action, index) => (

                <Can
                    key={index}
                    permissions={action.permissions}
                >

                    {action.type === 'link' ? (

                        <Link
                            href={action.href!}
                            className={`inline-flex items-center gap-2 rounded-xl bg-core-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-core-700 ${action.className ?? ''}`}
                        >

                            {action.icon}

                            {action.label}

                        </Link>

                    ) : (

                        <button
                            type="button"
                            onClick={action.onClick}
                            className={`inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition hover:bg-gray-50 ${action.className ?? ''}`}
                        >

                            {action.icon}

                            {action.label}

                        </button>

                    )}

                </Can>

            ))}

        </>

    );

}