import { Table } from '@tanstack/react-table';
import { Columns, Eye, EyeOff, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Dropdown } from '@/components/ui/dropdown';

interface Props<T> {
    table: Table<T>;
}

export function DataTableColumnVisibility<T>({
    table,
}: Props<T>) {
    const [filter, setFilter] = useState('');

    const columns = useMemo(() => {
        return table
            .getAllLeafColumns()
            .filter(column => column.getCanHide())
            .filter(column => {
                const label = String(
                    column.columnDef.meta?.export?.title ??
                    column.columnDef.header ??
                    column.id,
                ).toLowerCase();

                return label.includes(filter.toLowerCase());
            });
    }, [table, filter]);

    if (!columns.length) {
        return null;
    }

    const toggleAll = (visible: boolean) => {
        table
            .getAllLeafColumns()
            .filter(column => column.getCanHide())
            .forEach(column => column.toggleVisibility(visible));
    };

    return (
        <Dropdown.Root
            width="w-72"
            trigger={
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                    <Columns size={16} />
                    Colunas
                </button>
            }
        >
            <div className="border-b p-3">
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                        placeholder="Buscar coluna..."
                        className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="max-h-72 overflow-y-auto py-1">

                {columns.map(column => {

                    const label =
                        column.columnDef.meta?.label ??
                        column.id;

                    return (
                        <Dropdown.Item
                            key={column.id}
                            icon={
                                column.getIsVisible()
                                    ? <Eye size={16} />
                                    : <EyeOff size={16} />
                            }
                            onClick={() =>
                                column.toggleVisibility()
                            }
                        >
                            {label}
                        </Dropdown.Item>
                    );

                })}

            </div>

            <Dropdown.Divider />

            <Dropdown.Item
                onClick={() => toggleAll(true)}
            >
                Mostrar todas
            </Dropdown.Item>

            <Dropdown.Item
                onClick={() => toggleAll(false)}
            >
                Ocultar todas
            </Dropdown.Item>
        </Dropdown.Root>
    );
}