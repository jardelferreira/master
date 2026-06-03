import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { PageContainer } from '@/pages/components/PageContainer';
import { useState } from 'react';
import { router } from '@inertiajs/react';

import {
    Package,
    Pencil,
    Layers,
    Hash,
    FileText,
    Boxes,
    Warehouse,
    ClipboardList,
    AlertTriangle,
    Plus,
    Trash2
} from 'lucide-react';

import type { PageProps } from '@/types/inertia';

type ProjectOption = {
    id: number;
    name: string;
};

type SectorOption = {
    id: number;
    name: string;
    project_id: number;
};

import type {
    ProductShowData,
    ProductSelectCategory,
    ProductSelectUnit,
    ProductStockMinimal
} from '@/types/product';

import ProductFormModal from '@/pages/components/products/ProductFormModal';
import StockMinimalFormModal from '@/pages/components/products/StockMinimalFormModal';

type ProductShowPageProps = PageProps &
    ProductShowData & {
        categories: ProductSelectCategory[];
        units: ProductSelectUnit[];
        projects: ProjectOption[];
        sectors: SectorOption[];
    };

const tk = {
    card: 'bg-white border border-blue-100 rounded-2xl shadow-sm',
    cardBlue: 'bg-white border border-blue-600 rounded-2xl shadow-sm',
    sectionTitle:
        'text-[11px] font-bold uppercase tracking-widest text-blue-800',
};

const BASE_BTN =
    'inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition active:scale-[0.97] cursor-pointer';

function StatCard({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className={`${tk.card} p-4 space-y-1`}>
            <p
                className={`text-[10px] font-bold uppercase tracking-widest ${color}`}
            >
                {label}
            </p>

            <p className="text-xl font-bold text-zinc-900">
                {value}
            </p>
        </div>
    );
}

export default function ProductShow() {
    const {
        product,
        stats,
        invoice_items,
        categories,
        units,
        projects,
        sectors,
        stock_minimals,
    } = usePage<ProductShowPageProps>().props;

    const [editOpen, setEditOpen] = useState(false);

    const [stockModalOpen, setStockModalOpen] =
        useState(false);

    const [selectedStockMinimal, setSelectedStockMinimal] =
        useState<ProductStockMinimal | null>(null);

    function openCreateStockMinimal() {
        setSelectedStockMinimal(null);
        setStockModalOpen(true);
    }

    function openEditStockMinimal(
        item: ProductStockMinimal,
    ) {
        setSelectedStockMinimal(item);
        setStockModalOpen(true);
    }

    function deleteStockMinimal(id: number) {
        if (
            !window.confirm(
                'Deseja remover esta configuração?',
            )
        ) {
            return;
        }

        router.delete(
            route('admin.stock-minimals.destroy', id),
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <>
            <Head title={`Produto · ${product.name}`} />

            <PageContainer>
                <div className="space-y-3">
                    {/* Header */}
                    <div className="bg-white border border-blue-200 rounded-2xl px-6 py-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-semibold text-zinc-900">
                                    {product.name}
                                </h1>

                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${product.active
                                        ? 'bg-emerald-500/20 text-emerald-700'
                                        : 'bg-red-500/20 text-red-700'
                                        }`}
                                >
                                    {product.active
                                        ? 'Ativo'
                                        : 'Inativo'}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
                                <span>
                                    SKU:{' '}
                                    {product.sku ?? '—'}
                                </span>

                                <span>
                                    Categoria:{' '}
                                    {product.category?.name ??
                                        '—'}
                                </span>

                                <span>
                                    Unidade:{' '}
                                    {product.unit?.label ??
                                        '—'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setEditOpen(true)}
                            className={`${BASE_BTN} border border-blue-200 bg-white text-blue-700 hover:bg-blue-50`}
                        >
                            <Pencil size={14} />
                            Editar
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                        <StatCard
                            label="Estoque Atual"
                            value={String(
                                stats.stock_quantity,
                            )}
                            color="text-blue-700"
                        />

                        <StatCard
                            label="Entradas"
                            value={String(
                                stats.stocks_count,
                            )}
                            color="text-emerald-700"
                        />

                        <StatCard
                            label="Movimentações"
                            value={String(
                                stats.stock_movements_count,
                            )}
                            color="text-purple-700"
                        />

                        <StatCard
                            label="Notas"
                            value={String(
                                stats.invoice_items_count,
                            )}
                            color="text-zinc-500"
                        />

                        <StatCard
                            label="Estoque mínimo"
                            value={String(
                                stats.global_min_stock ??
                                0,
                            )}
                            color="text-amber-700"
                        />
                    </div>

                    {/* Body */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Main */}
                        <div className="lg:col-span-2 space-y-3">
                            <div className={`${tk.card} p-4`}>
                                <div className="flex items-center justify-between">
                                    <p className={tk.sectionTitle}>
                                        Configurações de estoque mínimo
                                    </p>

                                    <button
                                        onClick={openCreateStockMinimal}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                    >
                                        <Plus size={14} />
                                        Novo
                                    </button>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {stock_minimals.length === 0 ? (
                                        <p className="text-sm italic text-zinc-400">
                                            Nenhuma configuração cadastrada.
                                        </p>
                                    ) : (
                                        stock_minimals.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between rounded-xl border border-zinc-100 px-4 py-3"
                                            >
                                                <div>
                                                    <p className="font-medium text-zinc-900">
                                                        {item.scope === 'global' &&
                                                            'Global'}

                                                        {item.scope === 'project' &&
                                                            `Projeto: ${item.project?.name}`}

                                                        {item.scope === 'sector' &&
                                                            `${item.project?.name} • ${item.sector?.name}`}
                                                    </p>

                                                    <p className="text-xs text-zinc-400">
                                                        Quantidade mínima:{' '}
                                                        {item.min_quantity}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEditStockMinimal(item)
                                                        }
                                                        className="rounded-md p-2 hover:bg-blue-50"
                                                    >
                                                        <Pencil
                                                            size={16}
                                                            className="text-blue-600"
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            deleteStockMinimal(item.id)
                                                        }
                                                        className="rounded-md p-2 hover:bg-red-50"
                                                    >
                                                        <Trash2
                                                            size={16}
                                                            className="text-red-600"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className={`${tk.card} p-4`}>
                                <p className={tk.sectionTitle}>
                                    Itens de nota recentes
                                </p>

                                <div className="mt-4 space-y-2">
                                    {invoice_items.length ===
                                        0 ? (
                                        <p className="text-sm italic text-zinc-400">
                                            Nenhum vínculo com
                                            notas fiscais.
                                        </p>
                                    ) : (
                                        invoice_items.map(
                                            (item) => (
                                                <div
                                                    key={
                                                        item.id
                                                    }
                                                    className="flex items-center justify-between rounded-xl border border-zinc-100 px-4 py-3"
                                                >
                                                    <div>
                                                        <p className="font-medium text-zinc-900">
                                                            Nota #
                                                            {
                                                                item.invoice_id
                                                            }
                                                        </p>

                                                        <p className="text-xs text-zinc-400">
                                                            Quantidade:{' '}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="text-right text-xs text-zinc-500">
                                                        <p>
                                                            Aprovado:{' '}
                                                            {
                                                                item.approved_quantity
                                                            }
                                                        </p>

                                                        <p>
                                                            Recebido:{' '}
                                                            {
                                                                item.received_quantity
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    )}
                                </div>
                            </div>

                            <div className={`${tk.card} p-4`}>
                                <p className={tk.sectionTitle}>
                                    Descrição
                                </p>

                                <div className="mt-4">
                                    <p className="text-sm text-zinc-700 whitespace-pre-line">
                                        {product.description ??
                                            'Sem descrição cadastrada.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div
                                className={`${tk.cardBlue} p-4 space-y-4`}
                            >
                                <p
                                    className={`${tk.sectionTitle} text-center`}
                                >
                                    Detalhes do produto
                                </p>

                                <InfoRow
                                    icon={<Package size={14} />}
                                    label="Produto"
                                    value={product.name}
                                />

                                <InfoRow
                                    icon={<Hash size={14} />}
                                    label="SKU"
                                    value={
                                        product.sku ??
                                        'Sem SKU'
                                    }
                                />

                                <InfoRow
                                    icon={<Layers size={14} />}
                                    label="Categoria"
                                    value={
                                        product.category
                                            ?.name ??
                                        'Sem categoria'
                                    }
                                />

                                <InfoRow
                                    icon={<Boxes size={14} />}
                                    label="Unidade"
                                    value={
                                        product.unit
                                            ?.label ??
                                        '—'
                                    }
                                />

                                <InfoRow
                                    icon={
                                        <Warehouse
                                            size={14}
                                        />
                                    }
                                    label="Estoque atual"
                                    value={String(
                                        stats.stock_quantity,
                                    )}
                                />

                                <InfoRow
                                    icon={
                                        <AlertTriangle
                                            size={14}
                                        />
                                    }
                                    label="Estoque mínimo"
                                    value={String(
                                        stats.global_min_stock ??
                                        0,
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>

            <ProductFormModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                product={product}
                categories={categories}
                units={units}
            />
            <StockMinimalFormModal
                open={stockModalOpen}
                onClose={() => setStockModalOpen(false)}
                productId={product.id}
                stockMinimal={selectedStockMinimal}
                projects={projects}
                sectors={sectors}
            />
        </>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {icon}
            </span>

            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {label}
                </p>

                <p className="text-sm font-semibold text-zinc-800 break-words">
                    {value ?? '—'}
                </p>
            </div>
        </div>
    );
}

ProductShow.layout = (
    page: React.ReactNode,
) => <DashboardLayout>{page}</DashboardLayout>;