import { Link } from '@inertiajs/react';
import { DataTableProps } from '@/types/dataTable';
import { Can } from '@/components/auth/Can';

import {
    ColumnDef,
    ColumnMeta,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

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
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([{
        id: "id",desc: false
    }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="rounded-xl border border-base-200 bg-white shadow-sm">
            {/* Busca */}
            <div className="flex justify-between border-b border-base-200 p-4">
                <input
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full max-w-sm rounded-md border border-base-300 px-3 py-2 text-sm"
                />
                <div className="flex items-center gap-2">
                    {headerActions?.map((action, index) => (
                        <Can key={index} permissions={action.permissions}>
                            {action.type === 'link' ? (
                                <Link
                                    href={action.href}
                                    className={`inline-flex items-center gap-2 rounded-md bg-core-600 px-4 py-2 text-sm font-medium text-white hover:bg-core-700 ${action?.className}`}
                                >
                                    {action.icon}
                                    {action.label}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={action.onClick}
                                    className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-base-300 px-4 py-2 text-sm font-medium hover:bg-base-100 ${action?.className}`}
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            )}
                        </Can>
                    ))}
                </div>
            </div>
            {/* Tabela */}
            <table className="w-full text-sm">
                <thead className="border-b border-base-300 bg-base-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={`cursor-pointer px-4 py-3 text-left font-medium text-base-700 select-none ${header.column.columnDef.meta?.className ?? ''} `}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                    {{
                                        asc: ' ↑',
                                        desc: ' ↓',
                                    }[header.column.getIsSorted() as string] ??
                                        null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-6 text-center text-base-500"
                            >
                                Nenhum registro encontrado
                            </td>
                        </tr>
                    )}

                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.original.id}
                            className="border-b border-base-300 hover:bg-base-50 hover:bg-base-200"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className={`px-4 py-3 text-base-700 ${cell.column.columnDef.meta?.className ?? ''} `}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginação */}
            <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-base-600">
                    Página {table.getState().pagination.pageIndex + 1} de{' '}
                    {table.getPageCount()}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}
