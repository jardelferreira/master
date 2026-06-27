import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '../DataTable';

export interface InventoryStock {
    id: number;
    quantity: number;

    product: {
        id: number;
        name: string;
        sku: string | null;
        unit: string | null;
    };
}

type Props = {
    stocks: InventoryStock[];

    selectedStocks: number[];

    onSelectionChange: (
        stockIds: number[],
    ) => void;
};

export default function InventoryStocksTable({
    stocks,
    selectedStocks,
    onSelectionChange,
}: Props) {
    const columns = useMemo<
        ColumnDef<InventoryStock>[]
    >(
        () => [
            {
                accessorFn: (row) =>
                    row.product.name,
                id: 'product_name',
                header: 'Produto',
            },

            {
                accessorFn: (row) =>
                    row.product.sku,
                id: 'sku',
                header: 'SKU',
            },

            {
                accessorFn: (row) =>
                    row.product.unit,
                id: 'unit',
                header: 'Unidade',
            },

            {
                accessorKey: 'quantity',
                header: 'Quantidade Atual',

                cell: ({ row }) =>
                    Number(
                        row.original.quantity,
                    ).toLocaleString(
                        'pt-BR',
                    ),
            },
        ],
        [],
    );

    return (
        <DataTable
            data={stocks}
            columns={columns}
            searchPlaceholder="Buscar produto..."
            enableRowSelection
            onRowSelectionChange={(
                selectedRows,
            ) =>
                onSelectionChange(
                    selectedRows.map(
                        (stock) => stock.id,
                    ),
                )
            }
        />
    );
}