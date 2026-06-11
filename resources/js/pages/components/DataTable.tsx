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
                .getCoreRowModel()
                .rows
                .filter((row) => newSelection[row.id])
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
                className={`border-b p-5 ${isWarehouse
                    ? 'border-blue-100 bg-white'
                    : 'border-base-200'
                    }`}
            >
                <div className="flex items-center justify-between gap-4 overflow-x-auto">
                    <div className="relative w-full max-w-md shrink-0">
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

                    <div className="flex shrink-0 items-center gap-2">
                        <select
                            value={
                                table.getState().pagination.pageSize === Number.MAX_SAFE_INTEGER
                                    ? 0
                                    : table.getState().pagination.pageSize
                            }
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                table.setPageSize(
                                    val === 0
                                        ? Number.MAX_SAFE_INTEGER
                                        : val,
                                );
                            }}
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
                            <option value={0}>
                                Todos
                            </option>
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
            </div>

            {/* table */}
            <div className="overflow-x-auto">
                <table className="min-w-max w-full text-sm">
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
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const handler = table.getToggleAllPageRowsSelectedHandler();
                                                        if (typeof handler === 'function') handler(e as any);
                                                    }}
                                                    className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
                                                        table.getIsAllPageRowsSelected()
                                                            ? 'border-blue-600 bg-blue-600'
                                                            : table.getIsSomePageRowsSelected()
                                                                ? 'border-blue-400 bg-blue-100'
                                                                : 'border-gray-300 bg-white hover:border-blue-400'
                                                    }`}
                                                >
                                                    {table.getIsAllPageRowsSelected() && (
                                                        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                    {!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected() && (
                                                        <svg className="h-3 w-3 text-blue-600" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    )}
                                                </div>
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
                                    key={row.original.id}
                                    onClick={() => enableRowSelection && row.toggleSelected()}
                                    className={`border-b transition-colors ${
                                        enableRowSelection ? 'cursor-pointer' : ''
                                    } ${
                                        row.getIsSelected()
                                            ? 'bg-blue-50 hover:bg-blue-100'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {enableRowSelection && (
                                        <td
                                            className="px-4 py-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div
                                                onClick={row.getToggleSelectedHandler()}
                                                className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
                                                    row.getIsSelected()
                                                        ? 'border-blue-600 bg-blue-600'
                                                        : 'border-gray-300 bg-white hover:border-blue-400'
                                                }`}
                                            >
                                                {row.getIsSelected() && (
                                                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>
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
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-5 py-4">
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