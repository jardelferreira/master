import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';



import {
    ClipboardList,
    Eye,
    Plus,
} from 'lucide-react';

interface Inventory {
    id: number;

    name: string;

    status: string;

    due_date: string | null;

    items_count: number;

    project?: {
        id: number;
        name: string;
    };

    sector?: {
        id: number;
        name: string;
    };

    creator?: {
        id: number;
        name: string;
    };
}

interface Props {
    inventories: Inventory[];
}

export default function Index({
    inventories,
}: Props) {
    const columns: ColumnDef<Inventory>[] = [
        {
            accessorKey: 'name',
            header: 'Inventário',
        },

        {
            accessorFn: (row) =>
                row.project?.name,
            id: 'project',
            header: 'Projeto',
        },

        {
            accessorFn: (row) =>
                row.sector?.name,
            id: 'sector',
            header: 'Setor',
        },

        {
            accessorKey: 'items_count',
            header: 'Itens',
        },

        {
            accessorFn: (row) =>
                row.creator?.name,
            id: 'creator',
            header: 'Criado por',
        },

        {
            accessorKey: 'due_date',
            header: 'Prazo',

            cell: ({ row }) =>
                row.original.due_date
                    ? new Date(
                          row.original.due_date,
                      ).toLocaleDateString(
                          'pt-BR',
                      )
                    : '-',
        },

        {
            accessorKey: 'status',
            header: 'Status',

            cell: ({ row }) => {
                const status =
                    row.original.status;

                const styles = {
                    open: 'bg-blue-100 text-blue-700',

                    in_progress:
                        'bg-amber-100 text-amber-700',

                    finished:
                        'bg-purple-100 text-purple-700',

                    approved:
                        'bg-emerald-100 text-emerald-700',

                    cancelled:
                        'bg-red-100 text-red-700',
                };

                const labels = {
                    open: 'Aberto',

                    in_progress:
                        'Em Andamento',

                    finished:
                        'Finalizado',

                    approved:
                        'Aprovado',

                    cancelled:
                        'Cancelado',
                };

                return (
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            styles[
                                status as keyof typeof styles
                            ]
                        }`}
                    >
                        {
                            labels[
                                status as keyof typeof labels
                            ]
                        }
                    </span>
                );
            },
        },

        {
            id: 'actions',

            header: '',

            cell: ({ row }) => (
                <Link
                    href={route(
                        'admin.inventories.show',
                        row.original.id,
                    )}
                    className="inline-flex items-center gap-2 rounded-lg border border-base-200 px-3 py-2 text-sm hover:bg-base-100"
                >
                    <Eye size={16} />

                    Visualizar
                </Link>
            ),
        },
    ];

    const totalInventories =
        inventories.length;

    const openInventories =
        inventories.filter(
            (inventory) =>
                inventory.status ===
                'open',
        ).length;

    const progressInventories =
        inventories.filter(
            (inventory) =>
                inventory.status ===
                'in_progress',
        ).length;

    const finishedInventories =
        inventories.filter(
            (inventory) =>
                inventory.status ===
                    'finished' ||
                inventory.status ===
                    'approved',
        ).length;

    return (
        <DashboardLayout>
            <Head title="Inventários" />

            <div className="space-y-6 m-2">

                {/* Header */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 m-2 shadow-sm rounded-2xl">

                    <div>

                        <div className="flex items-center gap-3">

                            <ClipboardList
                                size={24}
                                className="text-core-600"
                            />

                            <h1 className="text-2xl font-bold">
                                Inventários
                            </h1>

                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Gerencie e acompanhe os
                            inventários.
                        </p>

                    </div>

                </div>

                {/* Métricas */}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <MetricCard
                        title="Total"
                        value={
                            totalInventories
                        }
                    />

                    <MetricCard
                        title="Abertos"
                        value={
                            openInventories
                        }
                    />

                    <MetricCard
                        title="Em Andamento"
                        value={
                            progressInventories
                        }
                    />

                    <MetricCard
                        title="Finalizados"
                        value={
                            finishedInventories
                        }
                    />

                </div>

                {/* Tabela */}

                <DataTable
                    data={inventories}
                    columns={columns}
                    searchPlaceholder="Buscar inventário..."
                    enableExport
                    enablePrint
                    exportFileName="inventarios"
                    headerActions={[
                        {
                            type: 'link',
                            label:
                                'Novo Inventário',
                            href: route(
                                'admin.inventories.create',
                            ),
                            icon: (
                                <Plus
                                    size={16}
                                />
                            ),
                            permissions: [
                                'inventory.create',
                            ],
                        },
                    ]}
                />
            </div>
        </DashboardLayout>
    );
}

function MetricCard({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-base-200 bg-white p-5 shadow-sm">

            <div className="text-sm font-medium text-gray-500">
                {title}
            </div>

            <div className="mt-2 text-3xl font-bold">
                {value}
            </div>

        </div>
    );
}