import { Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import {
    Check,
    ChevronDown,
    Search,
    X,
} from 'lucide-react';

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

export function DataTableSearchableFilter<T>({
    table,
    columnId,
    title,
    options,
}: Props<T>) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const columnFilters =
        table.getState().columnFilters;

    const selectedValues = useMemo(() => {
        const filter = columnFilters.find(
            (item) => item.id === columnId,
        );

        return Array.isArray(filter?.value)
            ? filter.value
            : [];
    }, [columnFilters, columnId]);

    const availableOptions = useMemo(() => {
        let source = options;

        if (!source?.length) {
            const uniqueValues = new Set<string>();

            table
                .getPreFilteredRowModel()
                .rows.forEach((row) => {
                    const value =
                        row.getValue(columnId);

                    if (
                        value !== null &&
                        value !== undefined &&
                        value !== ''
                    ) {
                        uniqueValues.add(
                            String(value),
                        );
                    }
                });

            source = Array.from(uniqueValues).map(
                (value) => ({
                    label: value,
                    value,
                }),
            );
        }

        return source.filter((option) =>
            option.label
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }, [table, columnId, options, search]);

    function setFilter(values: string[]) {
        const currentFilters =
            table.getState().columnFilters;

        const withoutCurrent =
            currentFilters.filter(
                (item) => item.id !== columnId,
            );

        if (values.length === 0) {
            table.setColumnFilters(
                withoutCurrent,
            );
            return;
        }

        table.setColumnFilters([
            ...withoutCurrent,
            {
                id: columnId,
                value: values,
            },
        ]);
    }

    function toggleValue(value: string) {
        const exists =
            selectedValues.includes(value);

        if (exists) {
            setFilter(
                selectedValues.filter(
                    (item) => item !== value,
                ),
            );
            return;
        }

        setFilter([
            ...selectedValues,
            value,
        ]);
    }

    function clearFilter() {
        setFilter([]);
        setSearch('');
    }

    return (
        <div className="relative z-40">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-blue-700">
                {title}
            </span>

            <button
                type="button"
                onClick={() =>
                    setOpen((prev) => !prev)
                }
                className="inline-flex min-h-[44px] min-w-[240px] flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-left"
            >
                {selectedValues.length === 0 ? (
                    <span className="text-sm text-gray-500">
                        Selecionar...
                    </span>
                ) : selectedValues.length <= 2 ? (
                    selectedValues.map((value) => (
                        <span
                            key={value}
                            className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                        >
                            {value}
                        </span>
                    ))
                ) : (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {selectedValues.length}{' '}
                        selecionados
                    </span>
                )}

                <ChevronDown
                    size={16}
                    className="ml-auto"
                />
            </button>

            {open && (
                <div className="absolute left-0 top-full z-[9999] mt-2 w-[340px] rounded-2xl border border-blue-100 bg-white shadow-2xl">
                    <div className="border-b border-blue-100 p-3">
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value,
                                    )
                                }
                                placeholder={`Buscar ${title.toLowerCase()}...`}
                                className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2">
                        {availableOptions.length ===
                            0 ? (
                            <div className="p-4 text-sm text-gray-500">
                                Nenhum resultado
                            </div>
                        ) : (
                            availableOptions.map(
                                (option) => {
                                    const active =
                                        selectedValues.includes(
                                            option.value,
                                        );

                                    return (
                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                toggleValue(
                                                    option.value,
                                                )
                                            }
                                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${active
                                                    ? 'bg-blue-50'
                                                    : 'hover:bg-blue-50'
                                                }`}
                                        >
                                            <div className="flex h-5 w-5 items-center justify-center rounded border border-blue-200">
                                                {active && (
                                                    <Check
                                                        size={
                                                            14
                                                        }
                                                        className="text-blue-700"
                                                    />
                                                )}
                                            </div>

                                            <span className="text-sm text-gray-700">
                                                {
                                                    option.label
                                                }
                                            </span>
                                        </button>
                                    );
                                },
                            )
                        )}
                    </div>

                    {selectedValues.length >
                        0 && (
                            <div className="border-t border-blue-100 p-3">
                                <button
                                    type="button"
                                    onClick={
                                        clearFilter
                                    }
                                    className="inline-flex items-center gap-2 text-sm font-medium text-red-600"
                                >
                                    <X size={14} />
                                    Limpar filtro
                                </button>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}