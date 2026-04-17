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

export type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T, any>[];
    searchPlaceholder?: string;
    headerActions?: HeaderAction[];
};
