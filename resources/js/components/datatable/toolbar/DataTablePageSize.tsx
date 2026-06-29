import { Table } from '@tanstack/react-table';
import { ListFilter } from 'lucide-react';

interface Props<T> {
    table: Table<T>;
    options: number[];
}

export function DataTablePageSize<T>({ table, options }: Props<T>) {
    const currentSize = table.getState().pagination.pageSize;

    return (
        <div className="relative inline-flex items-center">
            <ListFilter
                size={14}
                className="pointer-events-none absolute left-3 text-slate-400"
            />
            <select
                value={currentSize === Number.MAX_SAFE_INTEGER ? 0 : currentSize}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    table.setPageSize(value === 0 ? Number.MAX_SAFE_INTEGER : value);
                }}
                className="rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 hover:bg-slate-50"
            >
                {options.map((size) => (
                    <option key={size} value={size}>
                        {size} / página
                    </option>
                ))}
                <option value={0}>Todos</option>
            </select>
        </div>
    );
}