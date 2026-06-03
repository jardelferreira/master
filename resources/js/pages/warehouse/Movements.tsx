import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import WarehouseLayout from '@/pages/layouts/WarehouseLayout';
import { DataTable } from '@/pages/components/DataTable';

type Project = {
    id: number;
    name: string;
};

type Movement = {
    id: number;
    type: string;
    direction: 'in' | 'out';
    quantity: number;
    performed_at: string;
    notes?: string | null;

    product: {
        id: number;
        name: string;
        unit?: string | null;
    };

    sector?: {
        id: number;
        name: string;
    } | null;

    user?: {
        id: number;
        name: string;
    } | null;
};

type Props = {
    project: Project;
    movements: Movement[];
};

export default function WarehouseMovements() {
    const { project, movements } =
        usePage<Props>().props;

    const columns: ColumnDef<Movement>[] = [
        {
            accessorFn: (row) => row.product.name,
            id: 'product',
            header: 'Produto',
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-slate-900">
                        {row.original.product.name}
                    </p>

                    <p className="text-xs text-slate-500">
                        {row.original.product.unit ?? '—'}
                    </p>
                </div>
            ),
        },

        {
            accessorFn: (row) =>
                row.sector?.name ?? '',
            id: 'sector',
            header: 'Setor',
            cell: ({ row }) =>
                row.original.sector?.name ?? '—',
        },

        {
            accessorKey: 'type',
            header: 'Tipo',
            cell: ({ row }) => (
                <MovementTypeBadge
                    type={row.original.type}
                />
            ),
        },

        {
            accessorKey: 'direction',
            header: 'Direção',
            cell: ({ row }) => (
                <DirectionBadge
                    direction={
                        row.original.direction
                    }
                />
            ),
        },

        {
            accessorKey: 'quantity',
            header: 'Quantidade',
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.quantity}
                </span>
            ),
        },

        {
            accessorFn: (row) =>
                row.user?.name ?? '',
            id: 'user',
            header: 'Operador',
            cell: ({ row }) =>
                row.original.user?.name ??
                'Sistema',
        },

        {
            accessorKey: 'performed_at',
            header: 'Data',
            cell: ({ row }) => (
                <span className="text-sm">
                    {formatDate(
                        row.original.performed_at,
                    )}
                </span>
            ),
        },

        {
            accessorFn: (row) =>
                row.notes ?? '',
            id: 'notes',
            header: 'Observações',
            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {row.original.notes ?? '—'}
                </span>
            ),
        },
    ];

    return (
        <>
            <Head
                title={`Movimentações · ${project.name}`}
            />

            <div className="space-y-6">
                <div className='bg-white p-2 m-2 rounded'>
                    <p className="text-xs uppercase text-blue-800">
                        Almoxarifado
                    </p>

                    <h1 className="text-3xl font-bold text-blue-900">
                        Movimentações
                    </h1>

                    <p className="mt-2 text-sm ">
                        {project.name}
                    </p>
                </div>

                <DataTable<Movement>
                    data={movements}
                    columns={columns}
                    searchPlaceholder="Buscar produto, setor, operador ou observações..."
                />
            </div>
        </>
    );
}

WarehouseMovements.layout = (
    page: React.ReactNode,
) => (
    <WarehouseLayout>{page}</WarehouseLayout>
);

function MovementTypeBadge({
    type,
}: {
    type: string;
}) {
    const labels: Record<string, string> = {
        consumption: 'Consumo',
        transfer: 'Transferência',
        assignment: 'Atribuição',
        adjust: 'Ajuste',
        return: 'Devolução',
        loss: 'Perda',
    };

    return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {labels[type] ?? type}
        </span>
    );
}

function DirectionBadge({
    direction,
}: {
    direction: 'in' | 'out';
}) {
    if (direction === 'in') {
        return (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Entrada
            </span>
        );
    }

    return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Saída
        </span>
    );
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(date));
}