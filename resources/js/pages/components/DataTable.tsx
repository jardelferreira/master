import { Link } from '@inertiajs/react';
import { DataTableProps } from '@/types/dataTable';
import { Can } from '@/components/auth/Can';

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import * as XLSX from 'xlsx';
import { Search, Download, Printer } from 'lucide-react';
import { useMemo, useState } from 'react';

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        className?: string;
    }
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchPlaceholder = 'Buscar...',
    headerActions,
    enableRowSelection = false,
    onRowSelectionChange,

    variant = 'default',

    defaultPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],

    enableExport = false,
    exportFileName = 'export',

    enablePrint = false,

    initialSorting = [],
}: DataTableProps<T>) {
    const [sorting, setSorting] =
        useState<SortingState>(initialSorting);

    const [globalFilter, setGlobalFilter] =
        useState('');

    const [rowSelection, setRowSelection] =
        useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,

        state: {
            sorting,
            globalFilter,
            rowSelection,
        },

        initialState: {
            pagination: {
                pageSize: defaultPageSize,
            },
        },

        enableRowSelection,

        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,

        onRowSelectionChange: (updater) => {
            const newSelection =
                typeof updater === 'function'
                    ? updater(rowSelection)
                    : updater;

            setRowSelection(newSelection);

            const selectedRows = table
                .getSelectedRowModel()
                .rows
                .map((row) => row.original);

            onRowSelectionChange?.(selectedRows);
        },

        globalFilterFn: (row, _, filterValue) => {
            const search =
                String(filterValue).toLowerCase();

            return row
                .getVisibleCells()
                .some((cell) => {
                    const value = cell.getValue();

                    return String(value ?? '')
                        .toLowerCase()
                        .includes(search);
                });
        },

        getCoreRowModel:
            getCoreRowModel(),

        getSortedRowModel:
            getSortedRowModel(),

        getFilteredRowModel:
            getFilteredRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),
    });

    const exportRows = useMemo(() => {
        return table.getRowModel().rows.map((row) => {
            const original = row.original as Record<
                string,
                unknown
            >;

            const flattened: Record<
                string,
                unknown
            > = {};

            Object.entries(original).forEach(
                ([key, value]) => {
                    if (
                        value &&
                        typeof value === 'object' &&
                        !Array.isArray(value)
                    ) {
                        if (
                            'name' in value &&
                            typeof value.name ===
                            'string'
                        ) {
                            flattened[key] =
                                value.name;
                        } else {
                            flattened[key] =
                                JSON.stringify(
                                    value,
                                );
                        }

                        return;
                    }

                    flattened[key] = value;
                },
            );

            return flattened;
        });
    }, [table]);

    function exportExcel() {
        const worksheet =
            XLSX.utils.json_to_sheet(
                exportRows,
            );

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Dados',
        );

        XLSX.writeFile(
            workbook,
            `${exportFileName}.xlsx`,
        );
    }

    function exportCsv() {
        const worksheet =
            XLSX.utils.json_to_sheet(
                exportRows,
            );

        const csv =
            XLSX.utils.sheet_to_csv(
                worksheet,
            );

        const blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;',
        });

        const link =
            document.createElement('a');

        link.href =
            URL.createObjectURL(blob);

        link.download =
            `${exportFileName}.csv`;

        link.click();
    }

    function printTable() {
        window.print();
    }

    const isWarehouse =
        variant === 'warehouse';

    return (
        <div
            className={`rounded-2xl border bg-white shadow-sm ${isWarehouse
                ? 'border-blue-100'
                : 'border-base-200'
                }`}
        >
            {/* toolbar */}
            <div
                className={`flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between ${isWarehouse
                    ? 'border-blue-100 bg-white'
                    : 'border-base-200'
                    }`}
            >
                <div className="relative w-full max-w-md">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        value={globalFilter}
                        onChange={(e) =>
                            setGlobalFilter(
                                e.target.value,
                            )
                        }
                        placeholder={
                            searchPlaceholder
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={
                            table.getState()
                                .pagination
                                .pageSize
                        }
                        onChange={(e) =>
                            table.setPageSize(
                                Number(e.target.value),
                            )
                        }
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
                    >
                        {pageSizeOptions.map((size) => (
                            <option
                                key={size}
                                value={size}
                            >
                                {size} / página
                            </option>
                        ))}
                    </select>
                    {enableExport && (
                        <>
                            <button
                                type="button"
                                onClick={
                                    exportExcel
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                                <Download size={16} />
                                Excel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    exportCsv
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                            >
                                CSV
                            </button>
                        </>
                    )}

                    {enablePrint && (
                        <button
                            type="button"
                            onClick={printTable}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                        >
                            <Printer size={16} />
                            Imprimir
                        </button>
                    )}

                    {headerActions?.map(
                        (action, index) => (
                            <Can
                                key={index}
                                permissions={
                                    action.permissions
                                }
                            >
                                {action.type ===
                                    'link' ? (
                                    <Link
                                        href={
                                            action.href!
                                        }
                                        className={`inline-flex items-center gap-2 rounded-xl bg-core-600 px-4 py-2 text-sm font-medium text-white hover:bg-core-700 ${action.className ?? ''}`}
                                    >
                                        {
                                            action.icon
                                        }
                                        {
                                            action.label
                                        }
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={
                                            action.onClick
                                        }
                                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 ${action.className ?? ''}`}
                                    >
                                        {
                                            action.icon
                                        }
                                        {
                                            action.label
                                        }
                                    </button>
                                )}
                            </Can>
                        ),
                    )}
                </div>
            </div>

            {/* table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead
                        className={
                            isWarehouse
                                ? 'bg-blue-50'
                                : 'bg-base-100'
                        }
                    >
                        {table
                            .getHeaderGroups()
                            .map(
                                (
                                    headerGroup,
                                ) => (
                                    <tr
                                        key={
                                            headerGroup.id
                                        }
                                    >
                                        {enableRowSelection && (
                                            <th className="w-10 px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={table.getIsAllPageRowsSelected()}
                                                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                                                />
                                            </th>
                                        )}

                                        {headerGroup.headers.map(
                                            (
                                                header,
                                            ) => (
                                                <th
                                                    key={
                                                        header.id
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className={`cursor-pointer px-4 py-4 text-left font-semibold text-blue-950 select-none ${header.column.columnDef.meta?.className ?? ''}`}
                                                >
                                                    {flexRender(
                                                        header
                                                            .column
                                                            .columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                ),
                            )}
                    </thead>

                    <tbody>
                        {table
                            .getRowModel()
                            .rows.map((row) => (
                                <tr
                                    key={
                                        row.original.id
                                    }
                                    className="border-b hover:bg-gray-50"
                                >
                                    {enableRowSelection && (
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={row.getIsSelected()}
                                                onChange={row.getToggleSelectedHandler()}
                                            />
                                        </td>
                                    )}

                                    {row
                                        .getVisibleCells()
                                        .map(
                                            (
                                                cell,
                                            ) => (
                                                <td
                                                    key={
                                                        cell.id
                                                    }
                                                    className={`px-4 py-4 text-gray-700 ${cell.column.columnDef.meta?.className ?? ''}`}
                                                >
                                                    {flexRender(
                                                        cell
                                                            .column
                                                            .columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </td>
                                            ),
                                        )}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* footer */}
            <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <span className="text-sm text-gray-600">
                    {
                        table
                            .getFilteredRowModel()
                            .rows.length
                    }{' '}
                    registros
                </span>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() =>
                            table.previousPage()
                        }
                        disabled={
                            !table.getCanPreviousPage()
                        }
                        className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <button
                        onClick={() =>
                            table.nextPage()
                        }
                        disabled={
                            !table.getCanNextPage()
                        }
                        className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}