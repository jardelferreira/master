import { Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import { X } from 'lucide-react';

type FilterOption = {
    label: string;
    value: string;
};

type Props<T> = {
    table: Table<T>;
    columnId: string;
    title: string;
    options?: FilterOption[];
};

export function DataTableFacetedFilter<T>({
    table,
    columnId,
    title,
    options,
}: Props<T>) {
    const column = table.getColumn(columnId);

    if (!column) {
        return null;
    }

    const selectedValues =
        (column.getFilterValue() as string[]) ?? [];

    const availableOptions = useMemo(() => {
        if (options?.length) {
            return options;
        }

        const uniqueValues = new Set<string>();

        table
            .getPreFilteredRowModel()
            .rows.forEach((row) => {
                const value = row.getValue(columnId);

                if (value !== undefined && value !== null) {
                    uniqueValues.add(String(value));
                }
            });

        return Array.from(uniqueValues).map((value) => ({
            label: value,
            value,
        }));
    }, [table, columnId, options]);

    const toggleValue = (value: string) => {
        const exists = selectedValues.includes(value);

        const next = exists
            ? selectedValues.filter(
                (selected) => selected !== value,
            )
            : [...selectedValues, value];

        column.setFilterValue(
            next.length ? next : undefined,
        );
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                {title}
            </span>

            <div className="flex flex-wrap gap-2">
                {availableOptions.map((option) => {
                    const active = selectedValues.includes(
                        option.value,
                    );

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                toggleValue(option.value)
                            }
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${active
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                                }`}
                        >
                            {option.label}

                            {active && <X size={12} />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}