import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';
import { PageCard } from '@/pages/components/PageCard';
import { PageContainer } from '@/pages/components/PageContainer';
import { StockConsumeModal } from '@/pages/components/StockConsumeModal';

import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    TrendingDown,
    Boxes,
    MinusCircle,
    ArrowDownCircle,
} from 'lucide-react';
import { formatQuantity } from '@/utils/formatValues';

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type Invoice = {
    id: number;
    number: string;
    series: string;
    type: string;
}

type Product = {
    id: number;
    name: string;
    unit: string | null;
    min_quantity: number | null;
};

type StockItem = {
    id: number;
    uuid: string;
    product_id: number;
    project_name: string;
    product: Product;
    stock_quantity: number;
    stock_location: string | null;
    sector: {
        id: number;
        name: string;
    } | null;
    expires_at: string | null;
    serial: string | null;
    invoice: Invoice
};

type SummaryItem = {
    id: number;
    product_id: number;
    product: Product;
    total_quantity: number;
    stock_ids: number[];
};

type Props = {
    project: {
        id: number;
        name: string;
    };
    stocks: StockItem[];
    summary: SummaryItem[];
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getStockStatus(
    totalQuantity: number,
    minQuantity: number | null,
): 'no_control' | 'out' | 'low' | 'ok' {
    if (!minQuantity) return 'no_control';
    if (totalQuantity <= 0) return 'out';
    if (totalQuantity < minQuantity) return 'low';
    return 'ok';
}

/*
|--------------------------------------------------------------------------
| SUB-COMPONENTS
|--------------------------------------------------------------------------
*/

function StockSummaryCards({ stocks }: { stocks: StockItem[] }) {
    const stats = useMemo(() => {
        const grouped = stocks.reduce(
            (acc, stock) => {
                const pid = stock.product_id;
                if (!acc[pid]) {
                    acc[pid] = {
                        total: 0,
                        min: stock.product.min_quantity,
                    };
                }
                acc[pid].total += stock.stock_quantity;
                return acc;
            },
            {} as Record<number, { total: number; min: number | null }>,
        );

        const items = Object.values(grouped);
        const total = items.length;
        const outOfStock = items.filter((i) => i.min && i.total <= 0).length;
        const lowStock = items.filter(
            (i) => i.min && i.total > 0 && i.total < i.min,
        ).length;
        const healthy = items.filter((i) => !i.min || i.total >= i.min).length;
        const noControl = items.filter((i) => !i.min).length;

        return { total, outOfStock, lowStock, healthy, noControl };
    }, [stocks]);

    const cards = [
        {
            label: 'Total de itens',
            value: stats.total,
            icon: <Boxes size={16} className="text-blue-500" />,
            valueClass: 'text-neutral-800',
        },
        {
            label: 'Sem controle',
            value: stats.noControl,
            icon: <AlertTriangle size={16} className="text-neutral-400" />,
            valueClass: 'text-neutral-500',
        },
        {
            label: 'Estoque normal',
            value: stats.healthy,
            icon: <CheckCircle2 size={16} className="text-emerald-500" />,
            valueClass: 'text-emerald-700',
        },
        {
            label: 'Estoque baixo',
            value: stats.lowStock,
            icon: <TrendingDown size={16} className="text-amber-500" />,
            valueClass: 'text-amber-700',
        },
        {
            label: 'Sem estoque',
            value: stats.outOfStock,
            icon: <XCircle size={16} className="text-red-500" />,
            valueClass: 'text-red-700',
        },
    ];

    return (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
                >
                    <div className="mb-2 flex items-center gap-2">
                        {card.icon}
                        <span className="text-xs font-medium text-neutral-500">
                            {card.label}
                        </span>
                    </div>
                    <span
                        className={`text-2xl font-semibold ${card.valueClass}`}
                    >
                        {card.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

function PageHeader({ projectName }: { projectName: string }) {
    return (
        <div className="mb-6 flex items-start justify-between">
            <div>
                <div className="mb-1 flex items-center gap-2">
                    <Boxes size={20} className="text-blue-600" />
                    <h1 className="text-xl font-semibold text-neutral-900">
                        Controle de Estoque - {projectName}
                    </h1>
                </div>
                <p className="text-sm text-neutral-500">
                    Acompanhe a disponibilidade e os níveis mínimos dos seus
                    produtos.
                </p>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: ReturnType<typeof getStockStatus>;
}) {
    const map = {
        no_control: {
            label: 'Sem controle',
            className: 'bg-neutral-100 text-neutral-500',
        },
        out: {
            label: 'Sem estoque',
            className: 'bg-red-50 text-red-600',
        },
        low: {
            label: 'Estoque baixo',
            className: 'bg-amber-50 text-amber-700',
        },
        ok: {
            label: 'Normal',
            className: 'bg-emerald-50 text-emerald-700',
        },
    };

    const { label, className } = map[status];

    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${className}`}
        >
            {label}
        </span>
    );
}

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export default function StockIndex({ project, stocks, summary }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<SummaryItem | null>(
        null,
    );

    const getStocksForProduct = (productId: number) => {
        console.log(stocks);
        return stocks.filter((s) => s.product_id === productId);
    };

    const handleOpenModal = (item: SummaryItem) => {
        setSelectedProduct(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const columns: ColumnDef<SummaryItem>[] = [
        {
            accessorKey: "id",
            header: "Id"
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
            accessorKey: 'total_quantity',
            header: 'Quantidade',
            cell: ({ row }) => {
                const item = row.original;
                const status = getStockStatus(
                    item.total_quantity,
                    item.product.min_quantity,
                );
                const isWarning = status === 'low' || status === 'out';

                return (
                    <span
                        className={`font-medium tabular-nums ${
                            isWarning ? 'text-amber-700' : 'text-neutral-700'
                        }`}
                    >
                        {formatQuantity(item.total_quantity)}
                    </span>
                );
            },
        },
        {
            accessorKey: 'product.min_quantity',
            header: 'Estoque mínimo',
            cell: ({ row }) => {
                const { min_quantity } = row.original.product;
                const { total_quantity } = row.original;

                if (!min_quantity) {
                    return <span className="text-neutral-300">—</span>;
                }

                const status = getStockStatus(total_quantity, min_quantity);
                const isLow = status === 'low' || status === 'out';

                return (
                    <div className="flex items-center gap-1.5">
                        {isLow && (
                            <AlertTriangle
                                size={14}
                                className="shrink-0 text-amber-500"
                            />
                        )}
                        <span
                            className={`text-sm tabular-nums ${
                                isLow
                                    ? 'font-medium text-amber-700'
                                    : 'text-neutral-600'
                            }`}
                        >
                            {formatQuantity(min_quantity)}{' '}
                            <span className="text-xs text-neutral-400">
                                {row.original.product.unit}
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = getStockStatus(
                    row.original.total_quantity,
                    row.original.product.min_quantity,
                );
                return <StatusBadge status={status} />;
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                const item = row.original;
                const hasStock = item.total_quantity > 0;

                return (
                    <button
                        onClick={() => handleOpenModal(item)}
                        disabled={!hasStock}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            hasStock
                                ? 'border border-red-200 text-red-600 hover:bg-red-50'
                                : 'cursor-not-allowed border border-neutral-200 text-neutral-400'
                        }`}
                        title={
                            hasStock
                                ? 'Registrar baixa'
                                : 'Sem estoque disponível'
                        }
                    >
                        <MinusCircle size={14} />
                        Dar baixa
                    </button>
                );
            },
        },
    ];

    const headerActions = [
        {
            type: 'link' as const,
            label: 'Receber Items',
            icon: <ArrowDownCircle size={16} />,
            className:
                'bg-emerald-600 text-white hover:bg-emerald-700 transition-colors',
            href: route('admin.stock.pending',project.id),
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head title="Estoque" />

            <PageContainer>
                <PageCard>
                    <PageHeader projectName={project.name} />

                    <StockSummaryCards stocks={stocks} />

                    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <DataTable<SummaryItem>
                            data={summary}
                            columns={columns}
                            searchPlaceholder="Buscar produto..."
                            headerActions={headerActions}
                        />
                    </section>
                </PageCard>
            </PageContainer>

            {selectedProduct && (
                <StockConsumeModal
                    productName={selectedProduct.product.name}
                    productUnit={String(selectedProduct.product.unit)}
                    stockItems={getStocksForProduct(selectedProduct.product_id)}
                    isOpen={modalOpen}
                    onClose={handleCloseModal}

                />
            )}
        </>
    );
}

StockIndex.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
