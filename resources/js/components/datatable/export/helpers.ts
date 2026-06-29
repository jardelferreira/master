import { flexRender, Table } from '@tanstack/react-table';

import { ExportTable } from '../types';

export function getExportMatrix(
    table: ExportTable,
) {

    return [

        table.columns.map(c => c.title),

        ...table.rows.map(r => r.values),

    ];

}

export function getTableExportData<T>(
    table: Table<T>,
) {

    const headers = table
        .getVisibleLeafColumns()
        .map(column => {

            const header = column.columnDef.header;

            if (typeof header === 'string') {
                return header;
            }

            return column.id;

        });

    const rows = table
        .getRowModel()
        .rows
        .map(row => {

            return row
                .getVisibleCells()
                .map(cell => {

                    const value = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                    );

                    if (
                        typeof value === 'string' ||
                        typeof value === 'number'
                    ) {
                        return value;
                    }

                    const raw = cell.getValue();

                    if (
                        raw === null ||
                        raw === undefined
                    ) {
                        return '';
                    }

                    if (typeof raw === 'object') {

                        if (
                            'name' in (raw as any)
                        ) {
                            return (raw as any).name;
                        }

                        return JSON.stringify(raw);

                    }

                    return raw;

                });

        });

    return {

        headers,

        rows,

    };

}