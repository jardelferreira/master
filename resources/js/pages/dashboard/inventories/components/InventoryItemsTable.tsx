import { DataTable } from '@/pages/components/DataTable';

import { inventoryColumns, InventoryItemRow } from './Columns';

interface Props {
    items: InventoryItemRow[];

    onCount: (item: InventoryItemRow) => void;
}

export default function InventoryItemsTable({
    items,
    onCount,
}: Props) {

    return (
        <DataTable
            columns={inventoryColumns(onCount)}
            data={items}
            enableExport
            enablePrint
            exportFileName="inventario"
        />
    );
}