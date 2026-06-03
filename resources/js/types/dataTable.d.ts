export type HeaderAction =
    | {
          type: 'link';
          label: string;
          href: string;
          icon?: React.ReactNode;
          className?: string;
          onClick?: () => void;
          permissions?: string | string[];
      }
    | {
          type: 'button';
          label: string;
          onClick?: () => void;
          icon?: React.ReactNode;
          className?: string;
          permissions?: string | string[];
      };


export type DataTableHeaderAction = {
    permissions: string[];
    type: 'link' | 'button';
    label: string;
    icon?: React.ReactNode;
    className?: string;

    href?: string;
    onClick?: () => void;
};

export type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];

    searchPlaceholder?: string;
    headerActions?: DataTableHeaderAction[];

    enableRowSelection?: boolean;
    onRowSelectionChange?: (rows: T[]) => void;

    /* NOVOS */
    variant?: 'default' | 'warehouse';

    defaultPageSize?: number;
    pageSizeOptions?: number[];

    enableExport?: boolean;
    exportFileName?: string;

    enablePrint?: boolean;

    initialSorting?: SortingState;

    filters?: DataTableFilter[];
};

export type DataTableFilterOption = {
    label: string;
    value: string;
};

export type DataTableFilter = {
    columnId: string;
    title: string;
    options?: DataTableFilterOption[];
    variant?: 'badge' | 'searchable';
};