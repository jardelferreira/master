import {
    PaginationState,
    SortingState,
    VisibilityState,
    ColumnOrderState,
} from '@tanstack/react-table';

import {
    useEffect,
    useState,
} from 'react';

export interface DataTablePreferences {

    sorting: SortingState;

    pagination: PaginationState;

    globalFilter: string;

    columnVisibility: VisibilityState;

    columnOrder: ColumnOrderState;

}

const DEFAULT: DataTablePreferences = {

    sorting: [],

    pagination: {

        pageIndex: 0,

        pageSize: 10,

    },

    globalFilter: '',

    columnVisibility: {},

    columnOrder: [],

};

export function useDataTablePreferences(
    tableId: string,
) {

    const storageKey =
        `datatable:${tableId}`;

    const [preferences, setPreferences] =
        useState<DataTablePreferences>(() => {

            const stored =
                localStorage.getItem(
                    storageKey,
                );

            if (!stored) {

                return DEFAULT;

            }

            try {

                return {

                    ...DEFAULT,

                    ...JSON.parse(stored),

                };

            } catch {

                return DEFAULT;

            }

        });

    useEffect(() => {

        localStorage.setItem(

            storageKey,

            JSON.stringify(preferences),

        );

    }, [preferences, storageKey]);

    return {

        preferences,

        setPreferences,

    };

}