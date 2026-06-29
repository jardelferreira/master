import { Table } from '@tanstack/react-table';
import { ExportTable } from '../types';

interface BuildExportOptions {
    title?: string;
    subtitle?: string;
    company?: string;
    project?: string;
    logo?: string;
    generatedBy?: string;
}

/**
 * Resolves a column's display title for export purposes.
 *
 * Priority order:
 *  1. meta.export.title          — explicit override
 *  2. meta.label                 — visibility-picker label (human-readable)
 *  3. columnDef.header if string — simple string header
 *  4. column.id                  — last-resort fallback
 *
 * This avoids serialising the header render function to "[object Object]"
 * or the compiled JSX source that was ending up inside xlsx/pdf files.
 */
function resolveColumnTitle<T>(
    column: ReturnType<Table<T>['getVisibleLeafColumns']>[number],
): string {
    const meta = column.columnDef.meta;

    if (meta?.export?.title) {
        return meta.export.title;
    }

    if (meta?.label) {
        return meta.label;
    }

    const header = column.columnDef.header;
    if (typeof header === 'string' && header.trim() !== '') {
        return header;
    }

    return column.id;
}

export function buildExportTable<T>(
    table: Table<T>,
    options: BuildExportOptions = {},
): ExportTable {

    const columns = table
        .getVisibleLeafColumns()
        .filter(column =>
            column.columnDef.meta?.export?.exportable !== false,
        );

    return {
        title: options.title ?? 'Relatório',
        subtitle: options.subtitle,
        company: options.company,
        project: options.project,
        logo: options.logo,
        generatedBy: options.generatedBy,
        generatedAt: new Date(),

        columns: columns.map(column => ({
            id: column.id,
            title: resolveColumnTitle(column),
            width: column.columnDef.meta?.export?.width,
            align: column.columnDef.meta?.export?.align ?? 'left',
        })),

        rows: table
            .getFilteredRowModel()   // respects active search/filters
            .rows
            .map(row => ({
                values: columns.map(column => {
                    const value = row.getValue(column.id) as unknown;

                    const formatter = column.columnDef.meta?.export?.formatter;
                    if (formatter) {
                        return formatter(
                            value as never,
                            row.original as never,
                        );
                    }

                    if (value === null || value === undefined) {
                        return '';
                    }

                    return value;
                }),
            })),
    };
}