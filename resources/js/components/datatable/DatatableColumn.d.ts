import { ColumnDef } from '@tanstack/react-table';

export type DataTableColumnAlign = 'left' | 'center' | 'right';

/**
 * Convenience alias so page-level column definitions stay typed without
 * importing from @tanstack/react-table directly.
 *
 * The ColumnMeta interface augmentation lives in types.d.ts — do NOT
 * redeclare it here; TypeScript merges global augmentations and a second
 * `declare module '@tanstack/react-table'` block causes duplicate-key errors.
 */
export type DataTableColumn<T> = ColumnDef<T>;