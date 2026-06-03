import { Link } from '@inertiajs/react';
import { Search, Download, Printer } from 'lucide-react';
import { Can } from '@/components/auth/Can';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { DataTableSearchableFilter } from './DataTableSearchableFilter';
export function DataTableToolbar<T>({
    table,
    searchPlaceholder,
    filters = [],
    headerActions = [],
    enableExport = false,
    enablePrint = false,
    exportExcel,
    exportCsv,
    printCurrentView,
}: any) {
    return (
        <div className="space-y-5 border-b border-blue-100 bg-white p-5">
            {/* top row */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full max-w-md">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        value={
                            (table.getState()
                                .globalFilter as string) ?? ''
                        }
                        onChange={(e) =>
                            table.setGlobalFilter(
                                e.target.value,
                            )
                        }
                        placeholder={searchPlaceholder}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {enableExport && (
                        <>
                            <button
                                type="button"
                                onClick={exportExcel}
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700"
                            >
                                <Download size={16} />
                                Excel
                            </button>

                            <button
                                type="button"
                                onClick={exportCsv}
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700"
                            >
                                CSV
                            </button>
                        </>
                    )}

                    {enablePrint && (
                        <button
                            type="button"
                            onClick={printCurrentView}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                        >
                            <Printer size={16} />
                            Imprimir
                        </button>
                    )}

                    {headerActions.map(
                        (
                            action: any,
                            index: number,
                        ) => (
                            <Can
                                key={index}
                                permissions={
                                    action.permissions
                                }
                            >
                                {action.type ===
                                    'link' ? (
                                    <Link
                                        href={action.href}
                                        className="inline-flex items-center gap-2 rounded-xl bg-core-600 px-4 py-2 text-sm font-medium text-white"
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
                                        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium"
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

            {/* filters */}
            {filters.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-3">
                    {filters.map((filter: any) =>
                        filter.variant === 'searchable' ? (
                            <DataTableSearchableFilter
                                key={filter.columnId}
                                table={table}
                                columnId={filter.columnId}
                                title={filter.title}
                                options={filter.options}
                            />
                        ) : (
                            <DataTableFacetedFilter
                                key={filter.columnId}
                                table={table}
                                columnId={filter.columnId}
                                title={filter.title}
                                options={filter.options}
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
}