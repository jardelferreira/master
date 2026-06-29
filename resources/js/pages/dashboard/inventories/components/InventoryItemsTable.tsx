import { DataTable } from '@/components/datatable/DataTable';

import { inventoryColumns, InventoryItemRow } from './Columns';
import { inventoryColumnsV2 } from './InventoryColumnsV2';

interface Props {
    items: InventoryItemRow[];

    onCount: (item: InventoryItemRow) => void;
    meta: any,
}

export default function InventoryItemsTable({
    items,
    onCount,
    meta,
}: Props) {
    console.log(meta.name)
    return (
        <DataTable
        id="inventory"

        columns={inventoryColumnsV2(onCount)}

        data={items}

        enableColumnVisibility

        export={{
            excel: true,
            csv: true,
            pdf: true,
            print: true,
            filename: `inventario-${meta.name.toLowerCase().replace(/\s+/g, '-')}`,
            title: `inventario-${meta.name.toLowerCase().replace(/\s+/g, '-')}`,
            subtitle: "Tabela de itens de inventário"
        }}
        ></DataTable>
        // <DataTable
        //     columns={inventoryColumns(onCount)}
        //     data={items}
        //     enableExport
        //     enablePrint
        //     exportFileName="inventario"
        // />
    );
}