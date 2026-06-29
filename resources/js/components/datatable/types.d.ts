import { ColumnDef, SortingState } from '@tanstack/react-table';

/* -------------------------------------------------------------------------- */
/* Header Actions                                                              */
/* -------------------------------------------------------------------------- */

export interface DataTableHeaderAction {
    permissions: string[];
    type: 'link' | 'button';
    label: string;
    icon?: React.ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
}

/* -------------------------------------------------------------------------- */
/* Export                                                                      */
/* -------------------------------------------------------------------------- */

export type ExportAlign = 'left' | 'center' | 'right';

export interface ExportColumn {
    id: string;
    title: string;
    width?: number;
    align?: ExportAlign;
}

export interface ExportRow {
    values: unknown[];
}

export interface ExportTable {
    title: string;
    subtitle?: string;
    company?: string;
    project?: string;
    logo?: string;
    generatedBy?: string;
    generatedAt: Date;
    columns: ExportColumn[];
    rows: ExportRow[];
}

export interface DataTableExportOptions {
    excel?: boolean;
    csv?: boolean;
    pdf?: boolean;
    print?: boolean;
    filename?: string;
    title?: string;
    subtitle?: string;
    company?: string;
    project?: string;
    logo?: string;
    generatedBy?: string;
}

/* -------------------------------------------------------------------------- */
/* DataTable                                                                   */
/* -------------------------------------------------------------------------- */

export interface DataTableProps<T extends { id: string | number }> {
    id: string;
    data: T[];
    columns: DataTableColumn<T>[];
    searchPlaceholder?: string;
    headerActions?: DataTableHeaderAction[];
    enableRowSelection?: boolean;
    onRowSelectionChange?: (rows: T[]) => void;
    variant?: 'default' | 'warehouse';
    defaultPageSize?: number;
    pageSizeOptions?: number[];
    export?: DataTableExportOptions;
    initialSorting?: SortingState;
    enableColumnVisibility?: boolean;
}

/* -------------------------------------------------------------------------- */
/* TanStack augmentation — single declaration, no duplicates                  */
/* -------------------------------------------------------------------------- */

declare module '@tanstack/react-table' {

    interface ColumnMeta<TData, TValue> {
        /**
         * Label shown in the column-visibility picker.
         * Falls back to column.id when absent.
         */
        label?: string;

        /** Tailwind classes forwarded to every <td> / <th> in this column. */
        className?: string;

        /** Export / print behaviour for this column. */
        export?: {
            /** Column heading used in the exported file. */
            title?: string;
            /** Approximate column width (chars for xlsx, mm for pdf). */
            width?: number;
            /** Text alignment in the exported file. */
            align?: ExportAlign;
            /**
             * Set to false to hide this column from exports while keeping it
             * visible in the table.
             */
            exportable?: boolean;
            /**
             * Set to false to hide this column from the print view while
             * keeping it in exports.
             */
            printable?: boolean;
            /**
             * Optional value transformer applied before writing to the file.
             * Receives the raw cell value and the full row object.
             */
            formatter?: (value: TValue, row: TData) => unknown;
        };
    }

}