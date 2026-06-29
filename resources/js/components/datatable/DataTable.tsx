import { Link } from '@inertiajs/react';
import { DataTableProps } from './types';

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import { useState, useEffect } from 'react';
import { DataTableToolbar } from '@/components/datatable/DataTableToolbar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function DataTable<T extends { id: string | number }>({
    id,
    data,
    columns,
    searchPlaceholder = 'Buscar...',
    headerActions,
    enableRowSelection = false,
    onRowSelectionChange,
    variant = 'default',
    defaultPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    export: exportOptions,
    initialSorting = [],
    enableColumnVisibility = true,
}: DataTableProps<T>) {

    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const STORAGE_KEY = `datatable:${id}:columns`;

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columnVisibility));
    }, [STORAGE_KEY, columnVisibility]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter, rowSelection, columnVisibility },
        initialState: { pagination: { pageSize: defaultPageSize } },
        enableRowSelection,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: (updater) => {
            const newSelection =
                typeof updater === 'function' ? updater(rowSelection) : updater;
            setRowSelection(newSelection);
            queueMicrotask(() => {
                onRowSelectionChange?.(
                    table.getSelectedRowModel().rows.map((r) => r.original),
                );
            });
        },
        globalFilterFn: (row, _, filterValue) => {
            const search = String(filterValue).toLowerCase();
            return row.getVisibleCells().some((cell) =>
                String(cell.getValue() ?? '').toLowerCase().includes(search),
            );
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const isWarehouse = variant === 'warehouse';
    const rows = table.getRowModel().rows;
    const filteredCount = table.getFilteredRowModel().rows.length;
    const { pageIndex, pageSize } = table.getState().pagination;
    const from = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, filteredCount);

    return (
        <div className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm ${
            isWarehouse ? 'border-blue-100' : 'border-slate-200'
        }`}>

            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <DataTableToolbar
                table={table}
                searchPlaceholder={searchPlaceholder}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                pageSizeOptions={pageSizeOptions}
                exportOptions={exportOptions}
                headerActions={headerActions}
                enableColumnVisibility={enableColumnVisibility}
            />

            {/* ── Table ───────────────────────────────────────────────────── */}
            <div className="overflow-x-auto">
                <table className="min-w-max w-full text-sm">
                    <thead className={isWarehouse ? 'bg-blue-50' : 'bg-slate-50'}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>

                                {/* Selection checkbox column */}
                                {enableRowSelection && (
                                    <th className="w-10 px-4 py-3.5">
                                        <Checkbox
                                            checked={table.getIsAllPageRowsSelected()}
                                            indeterminate={table.getIsSomePageRowsSelected()}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                table.getToggleAllPageRowsSelectedHandler()(e as any);
                                            }}
                                        />
                                    </th>
                                )}

                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={[
                                            'px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide select-none',
                                            isWarehouse ? 'text-blue-800' : 'text-slate-500',
                                            header.column.getCanSort() ? 'cursor-pointer hover:text-slate-800' : '',
                                            header.column.columnDef.meta?.className ?? '',
                                        ].join(' ')}
                                    >
                                        <span className="inline-flex items-center gap-1.5">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {header.column.getCanSort() && (
                                                <SortIcon direction={header.column.getIsSorted()} />
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                                    className="px-4 py-16 text-center text-sm text-slate-400"
                                >
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr
                                    key={row.original.id}
                                    onClick={() => enableRowSelection && row.toggleSelected()}
                                    className={[
                                        'transition-colors',
                                        enableRowSelection ? 'cursor-pointer' : '',
                                        row.getIsSelected()
                                            ? 'bg-blue-50 hover:bg-blue-100'
                                            : 'hover:bg-slate-50',
                                    ].join(' ')}
                                >
                                    {enableRowSelection && (
                                        <td
                                            className="px-4 py-3.5"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                checked={row.getIsSelected()}
                                                onChange={row.getToggleSelectedHandler() as any}
                                            />
                                        </td>
                                    )}

                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={[
                                                'px-4 py-3.5 text-slate-700',
                                                cell.column.columnDef.meta?.className ?? '',
                                            ].join(' ')}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Footer / Pagination ──────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                <span className="text-xs text-slate-500">
                    {filteredCount === 0
                        ? 'Sem registros'
                        : `${from}–${to} de ${filteredCount} registro${filteredCount !== 1 ? 's' : ''}`}
                </span>

                <div className="flex items-center gap-1">
                    <PaginationButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        label="Anterior"
                        icon={<ChevronLeft size={14} />}
                    />

                    {/* Page number pills */}
                    {buildPageRange(table.getPageCount(), pageIndex).map((item, i) =>
                        item === '...' ? (
                            <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-400">
                                …
                            </span>
                        ) : (
                            <button
                                key={item}
                                onClick={() => table.setPageIndex(item as number)}
                                className={[
                                    'min-w-[2rem] rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                                    item === pageIndex
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100',
                                ].join(' ')}
                            >
                                {(item as number) + 1}
                            </button>
                        ),
                    )}

                    <PaginationButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        label="Próxima"
                        icon={<ChevronRight size={14} />}
                        iconRight
                    />
                </div>
            </div>
        </div>
    );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function Checkbox({
    checked,
    indeterminate = false,
    onChange,
}: {
    checked: boolean;
    indeterminate?: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
    return (
        <div
            className={[
                'flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-colors',
                checked
                    ? 'border-blue-600 bg-blue-600'
                    : indeterminate
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-300 bg-white hover:border-blue-400',
            ].join(' ')}
            onClick={(e) => e.stopPropagation()}
        >
            {checked && (
                <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            {!checked && indeterminate && (
                <svg className="h-2.5 w-2.5 text-blue-600" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            )}
        </div>
    );
}

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
    return (
        <svg
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
            className={direction ? 'text-blue-600' : 'text-slate-300'}
        >
            <path
                d="M5 1L5 13M5 1L2 4M5 1L8 4"
                stroke={direction === 'asc' ? 'currentColor' : '#cbd5e1'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5 13L2 10M5 13L8 10"
                stroke={direction === 'desc' ? 'currentColor' : '#cbd5e1'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PaginationButton({
    onClick,
    disabled,
    label,
    icon,
    iconRight = false,
}: {
    onClick: () => void;
    disabled: boolean;
    label: string;
    icon: React.ReactNode;
    iconRight?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
            {!iconRight && icon}
            {label}
            {iconRight && icon}
        </button>
    );
}

/** Builds a compact page range with ellipsis for large page counts. */
function buildPageRange(pageCount: number, current: number): (number | '...')[] {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, i) => i);
    }
    const pages: (number | '...')[] = [0];
    if (current > 2) pages.push('...');
    for (let i = Math.max(1, current - 1); i <= Math.min(pageCount - 2, current + 1); i++) {
        pages.push(i);
    }
    if (current < pageCount - 3) pages.push('...');
    pages.push(pageCount - 1);
    return pages;
}