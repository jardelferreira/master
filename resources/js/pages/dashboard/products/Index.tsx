import { Head, usePage, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    Package,
} from 'lucide-react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';
import { PageCard } from '@/pages/components/PageCard';
import { PageContainer } from '@/pages/components/PageContainer';
import ConfirmModal from '@/pages/components/ConfirmModal';
import { ToggleUser } from '@/components/ui/ToggleControl';
import { usePermission } from '@/hooks/usePermission';
import type { PageProps } from '@/types/inertia';

import type {
    Product,
    ProductSelectCategory,
    ProductSelectUnit,
} from '@/types/product';

import ProductFormModal from '@/pages/components/products/ProductFormModal';

type ProductsPageProps = PageProps & {
    products: Product[];
    categories: ProductSelectCategory[];
    units: ProductSelectUnit[];
};

export default function ProductsIndex() {
    const {
        products,
        categories,
        units,
    } = usePage<ProductsPageProps>().props;

    const { can } = usePermission();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] =
        useState<number | null>(null);

    const [formModalOpen, setFormModalOpen] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);

    function openDeleteModal(id: number) {
        setSelectedProductId(id);
        setConfirmOpen(true);
    }

    function closeDeleteModal() {
        setConfirmOpen(false);
        setSelectedProductId(null);
    }

    function confirmDelete() {
        if (!selectedProductId) return;

        router.delete(
            route('admin.products.destroy', selectedProductId),
            {
                onFinish: closeDeleteModal,
            },
        );
    }

    function openCreateModal() {
        setSelectedProduct(null);
        setFormModalOpen(true);
    }

    function openEditModal(product: Product) {
        setSelectedProduct(product);
        setFormModalOpen(true);
    }

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'id',
            header: '#',
            meta: { className: 'w-16 font-medium' },
        },

        {
            accessorKey: 'name',
            header: 'Produto',
            cell: ({ row }) => {
                const p = row.original;

                return (
                    <div>
                        <p className="font-medium text-base-900">
                            {p.name}
                        </p>

                        <p className="text-xs text-base-400">
                            {p.slug}
                        </p>
                    </div>
                );
            },
        },

        {
            accessorKey: 'sku',
            header: 'SKU',
            cell: ({ getValue }) =>
                getValue<string>() ?? (
                    <span className="text-base-300">
                        —
                    </span>
                ),
        },

        {
            accessorFn: (row) => row.category?.name ?? '',
            id: 'category',
            header: 'Categoria',
            cell: ({ row }) => {
                const p = row.original;

                if (!p.category) {
                    return (
                        <span className="text-base-300">
                            —
                        </span>
                    );
                }

                return (
                    <span className="text-sm text-base-600">
                        {p.category.name}
                    </span>
                );
            },
        },

        {
            id: 'unit',
            accessorFn: (row) => row.unit?.label ?? '',
            header: 'Unidade',
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.unit?.label ?? '—'}
                </span>
            ),
        },

        {
            id: 'stock',
            header: 'Estoque',
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.stock_quantity ?? 0}
                </span>
            ),
        },

        {
            accessorKey: 'active',
            header: 'Status',
            cell: ({ row, getValue }) => {
                const product = row.original;
                const value = getValue<boolean>();

                if (!can('products.update')) {
                    return value ? (
                        <p className="text-green-500 font-bold">
                            Ativo
                        </p>
                    ) : (
                        <p className="text-red-500 font-bold">
                            Inativo
                        </p>
                    );
                }

                return (
                    <ToggleUser
                        initialValue={value}
                        onChange={async () => {
                            await router.post(
                                route(
                                    'admin.products.toggleStatus',
                                    product.id,
                                ),
                                {},
                                {
                                    preserveScroll: true,
                                    onSuccess: () =>
                                        router.reload({
                                            only: [
                                                'products',
                                                'flash',
                                            ],
                                        }),
                                },
                            );
                        }}
                    />
                );
            },
        },

        {
            id: 'actions',
            header: 'Ações',
            meta: { className: 'w-24 text-right' },

            cell: ({ row }) => {
                const product = row.original;

                return (
                    <div className="flex justify-end gap-2">
                        {can('products.update') && (
                            <button
                                onClick={() =>
                                    openEditModal(product)
                                }
                                className="rounded-md p-2 hover:bg-base-100 cursor-pointer"
                                title="Editar produto"
                            >
                                <Pencil className="h-4 w-4 text-core-600" />
                            </button>
                        )}

                        {can('products.delete') && (
                            <button
                                onClick={() =>
                                    openDeleteModal(product.id)
                                }
                                className="rounded-md p-2 hover:bg-red-50 cursor-pointer"
                                title="Excluir produto"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                        )}

                        {can('products.view') && (
                            <a
                                href={route(
                                    'admin.products.show',
                                    product.id,
                                )}
                                className="rounded-md p-2 hover:bg-blue-50 cursor-pointer"
                                title="Visualizar"
                            >
                                <Eye className="h-5 w-5 text-blue-600" />
                            </a>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Produtos" />

            <PageContainer>
                <PageCard>
                    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
                        <DataTable<Product>
                            data={products}
                            columns={columns}
                            searchPlaceholder="Buscar produto por nome, SKU ou categoria..."
                            headerActions={[
                                {
                                    permissions: [
                                        'products.create',
                                        'products.manager',
                                    ],
                                    type: 'button',
                                    onClick: openCreateModal,
                                    label: 'Novo Produto',
                                    icon: (
                                        <Plus className="h-5 w-5" />
                                    ),
                                    className:
                                        'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] border-0 hover:opacity-95',
                                },
                            ]}
                        />
                    </section>
                </PageCard>
            </PageContainer>

            {confirmOpen && (
                <ConfirmModal
                    open={confirmOpen}
                    title="Excluir produto"
                    description="Esta ação não poderá ser desfeita. Deseja continuar?"
                    confirmText="Excluir"
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                />
            )}

            <ProductFormModal
                open={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                product={selectedProduct}
                categories={categories}
                units={units}
            />
        </>
    );
}

ProductsIndex.layout = (
    page: React.ReactNode,
) => <DashboardLayout>{page}</DashboardLayout>;