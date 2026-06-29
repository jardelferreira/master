import { Table } from '@tanstack/react-table';

import { DataTableExportMenu } from './toolbar/DataTableExportMenu';
import { DataTableHeaderActions } from './toolbar/DataTableHeaderActions';
import { DataTablePageSize } from './toolbar/DataTablePageSize';
import { DataTableSearch } from './toolbar/DataTableSearch';
import { DataTableColumnVisibility } from './toolbar/DataTableColumnVisibility';

import { DataTableExportOptions, DataTableHeaderAction } from './types';

interface Props<T> {
    table: Table<T>;
    searchPlaceholder: string;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    pageSizeOptions: number[];
    exportOptions?: DataTableExportOptions;
    headerActions?: DataTableHeaderAction[];
    enableColumnVisibility?: boolean;
}

export function DataTableToolbar<T>({
    table,
    searchPlaceholder,
    globalFilter,
    setGlobalFilter,
    pageSizeOptions,
    exportOptions,
    headerActions,
    enableColumnVisibility,
}: Props<T>) {
    return (
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Left — search */}
            <DataTableSearch
                value={globalFilter}
                onChange={setGlobalFilter}
                placeholder={searchPlaceholder}
            />

            {/* Right — controls */}
            <div className="flex flex-wrap items-center gap-2">
                <DataTablePageSize
                    table={table}
                    options={pageSizeOptions}
                />

                {enableColumnVisibility && (
                    <DataTableColumnVisibility table={table} />
                )}

                <DataTableExportMenu
                    table={table}
                    options={exportOptions}
                />

                <DataTableHeaderActions actions={headerActions} />
            </div>
        </div>
    );
}