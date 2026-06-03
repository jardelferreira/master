import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { router } from '@inertiajs/react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';
import { PageCard } from '@/pages/components/PageCard';
import { PageContainer } from '@/pages/components/PageContainer';
import { StockEntryModal } from '@/pages/components/StockEntryModal';

import {
    Package,
    ArrowDownCircle,
    ArrowLeft,
    FileText,
    CheckCircle,
} from 'lucide-react';
import { formatQuantity } from '@/utils/formatValues';
import { ProjectFromStocks } from '@/types/project';

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type PendingItem = {
    id: number;
    uuid: string;
    product: {
        id: number;
        name: string;
        unit: string | null;
    };
    invoice: {
        id: number;
        number: string;
        provider_name: string;
    };
    quantity: number;
    approved_quantity: number;
    entered_quantity: number;
    pending_quantity: number;
};

type Props = {
    pendingItems: PendingItem[];
    project: ProjectFromStocks
};

/*
|--------------------------------------------------------------------------
| SUB-COMPONENTS
|--------------------------------------------------------------------------
*/

function PageHeader({ projectId }: { projectId?: number }) {
    return (
        <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
                {/* ESQUERDA */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() =>
                            projectId
                                ? router.visit(route('admin.projects.stock', projectId))
                                : router.visit(document.referrer)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 
                        px-3 py-2 text-white hover:bg-neutral-100 hover:text-blue-600 cursor-pointer
                         transition bg-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Voltar
                    </button>

                    <div className="flex items-center gap-2">
                        <ArrowDownCircle size={20} className="text-emerald-600" />
                        <h1 className="text-xl font-semibold text-neutral-900">
                            Receber Items
                        </h1>
                    </div>
                </div>
            </div>

            <p className="text-sm text-neutral-500">
                Items de notas fiscais aguardando entrada no estoque.
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle size={48} className="mb-4 text-emerald-400" />
            <h3 className="text-lg font-medium text-neutral-700">
                Nenhum item pendente
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
                Todos os items aprovados já foram recebidos no estoque.
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export default function StockEntry({ pendingItems, project }: Props) {
    const [selectedItems, setSelectedItems] = useState<PendingItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectionChange = (items: PendingItem[] = []) => {
        setSelectedItems(items);
    };
    
    const handleOpenModal = () => {
        if (selectedItems.length > 0) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItems([]);
    };

    const columns: ColumnDef<PendingItem>[] = [
        {
            accessorKey: "id",
        },
        {
            accessorKey: 'product.name',
            header: 'Produto',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-neutral-800">
                        {row.original.product.name}
                    </span>
                    <span className="text-xs text-neutral-400">
                        {row.original.product.unit}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'invoice.number',
            header: 'Nota Fiscal',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="flex items-center gap-1 text-sm text-neutral-700">
                        <FileText size={12} className="text-neutral-400" />
                        {row.original.invoice.number}
                    </span>
                    <span className="text-xs text-neutral-400">
                        {row.original.invoice.provider_name}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'approved_quantity',
            header: 'Aprovado',
            cell: ({ row }) => (
                <span className="font-medium tabular-nums text-neutral-700">
                    {formatQuantity(row.original.approved_quantity)}{' '}
                    <span className="text-neutral-400 text-xs">
                        {row.original.product.unit}
                    </span>
                </span>
            ),
        },
        {
            accessorKey: 'entered_quantity',
            header: 'Recebido',
            cell: ({ row }) => (
                <span className="font-medium tabular-nums text-emerald-600">
                    {formatQuantity(row.original.entered_quantity)}{' '}
                    <span className="text-neutral-400 text-xs">
                        {row.original.product.unit}
                    </span>
                </span>
            ),
        },
        {
            accessorKey: 'pending_quantity',
            header: 'Pendente',
            cell: ({ row }) => (
                <span className="font-medium tabular-nums text-amber-600">
                    {formatQuantity(row.original.pending_quantity)}{' '}
                    <span className="text-neutral-400 text-xs">
                        {row.original.product.unit}
                    </span>
                </span>
            ),
        },
    ];

    if (pendingItems.length === 0) {
        return (
            <>
                <Head title="Receber Items" />

                <PageContainer>
                    <PageCard>
                        <PageHeader  projectId={project.id} />
                        <EmptyState />
                    </PageCard>
                </PageContainer>
            </>
        );
    }

    return (
        <>
            <Head title="Receber Items" />

            <PageContainer>
                <PageCard>
                    <PageHeader  projectId={project.id}/>

                    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <DataTable<PendingItem>
                            data={pendingItems}
                            columns={columns}
                            searchPlaceholder="Buscar item..."
                            enableRowSelection={true}
                            onRowSelectionChange={handleSelectionChange}
                            headerActions={
                                selectedItems?.length > 0
                                    ? [
                                          {
                                              type: 'button' as const,
                                              label: `Receber ${selectedItems.length} item(ns)`,
                                              icon: <ArrowDownCircle size={16} />,
                                              className:
                                                  'bg-emerald-600 text-white hover:bg-emerald-700 transition-colors',
                                              onClick: handleOpenModal,
                                          },
                                      ]
                                    : []
                            }
                        />
                    </section>
                </PageCard>
            </PageContainer>

            {selectedItems.length > 0 && (
                <StockEntryModal
                    items={selectedItems}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}

StockEntry.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
