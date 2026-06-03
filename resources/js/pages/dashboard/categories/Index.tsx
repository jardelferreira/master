import { Head, usePage, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';
import { PageCard } from '@/pages/components/PageCard';
import { PageContainer } from '@/pages/components/PageContainer';
import ConfirmModal from '@/pages/components/ConfirmModal';
import { usePermission } from '@/hooks/usePermission';
import { ToggleUser } from '@/components/ui/ToggleControl';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import type { PageProps } from '@/types/inertia';
import type { Category } from '@/types/category';
import CategoryFormModal from '@/pages/components/categories/CategoryFormModal';

type ParentCategory = {
    id: number;
    name: string;
    parent_id?: number | null;
};

type CategoriesPageProps = PageProps & {
    categories: Category[];
    parents: ParentCategory[];
};

export default function CategoriesIndex() {
    const { categories, parents } =
        usePage<CategoriesPageProps>().props;

    const { can } = usePermission();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] =
        useState<number | null>(null);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    function openDeleteModal(id: number) {
        setSelectedCategoryId(id);
        setConfirmOpen(true);
    }

    function closeDeleteModal() {
        setConfirmOpen(false);
        setSelectedCategoryId(null);
    }

    function confirmDelete() {
        if (!selectedCategoryId) return;

        router.delete(
            route('admin.categories.destroy', selectedCategoryId),
            {
                onFinish: closeDeleteModal,
            },
        );
    }

    function openCreateModal() {
        setSelectedCategory(null);
        setFormModalOpen(true);
    }

    function openEditModal(category: Category) {
        setSelectedCategory(category);
        setFormModalOpen(true);
    }

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'id',
            header: '#',
            meta: { className: 'w-16 font-medium' },
        },

        {
            id: 'name',
            header: 'Categoria',
            cell: ({ row }) => {
                const c = row.original;

                return (
                    <div>
                        <p className="font-medium text-base-900">
                            {c.name}
                        </p>

                        <p className="text-xs text-base-400">
                            {c.slug}
                        </p>
                    </div>
                );
            },
        },

        {
            id: 'parent',
            header: 'Categoria Pai',
            cell: ({ row }) => {
                const c = row.original;

                if (!c.parent) {
                    return (
                        <span className="text-base-300">
                            Categoria raiz
                        </span>
                    );
                }

                return (
                    <span className="text-sm text-base-600">
                        {c.parent.name}
                    </span>
                );
            },
        },

        {
            accessorKey: 'products_count',
            header: 'Produtos',
            cell: ({ getValue }) => (
                <span className="font-medium">
                    {getValue<number>() ?? 0}
                </span>
            ),
        },

        {
            accessorKey: 'children_count',
            header: 'Subcategorias',
            cell: ({ getValue }) => (
                <span className="font-medium">
                    {getValue<number>() ?? 0}
                </span>
            ),
        },

        {
            accessorKey: 'active',
            header: 'Status',
            cell: ({ row, getValue }) => {
                const category = row.original;
                const value = getValue<boolean>();

                if (!can('categories.update')) {
                    return value ? (
                        <p className="text-green-500 font-bold">
                            Ativa
                        </p>
                    ) : (
                        <p className="text-red-500 font-bold">
                            Inativa
                        </p>
                    );
                }

                return (
                    <ToggleUser
                        initialValue={value}
                        onChange={async () => {
                            await router.post(
                                route(
                                    'admin.categories.toggleStatus',
                                    category.id,
                                ),
                                {},
                                {
                                    preserveScroll: true,
                                    onSuccess: () =>
                                        router.reload({
                                            only: [
                                                'categories',
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
                const category = row.original;

                return (
                    <div className="flex justify-end gap-2">
                        {can('categories.update') && (
                            <button
                                onClick={() =>
                                    openEditModal(category)
                                }
                                className="rounded-md p-2 hover:bg-base-100 cursor-pointer"
                                title="Editar categoria"
                            >
                                <Pencil className="h-4 w-4 text-core-600" />
                            </button>
                        )}

                        {can('categories.delete') && (
                            <button
                                onClick={() =>
                                    openDeleteModal(category.id)
                                }
                                className="rounded-md p-2 hover:bg-red-50 cursor-pointer"
                                title="Excluir categoria"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                        )}

                        {can('categories.view') && (
                            <a
                                href={route(
                                    'admin.categories.show',
                                    category.id,
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
            <Head title="Categorias" />

            <PageContainer>
                <PageCard>
                    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
                        <DataTable<Category>
                            data={categories}
                            columns={columns}
                            searchPlaceholder="Buscar categoria por nome ou slug..."
                            headerActions={[
                                {
                                    permissions: [
                                        'categories.create',
                                        'categories.manager',
                                    ],
                                    type: 'button',
                                    onClick: openCreateModal,
                                    label: 'Nova Categoria',
                                    icon: (
                                        <Plus className="h-5 w-5" />
                                    ),
                                    className:
                                        'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] border-0 hover:opacity-95',
                                },
                            ]}
                            // emptyState={{
                            //     icon: <Layers size={36} />,
                            //     title: 'Nenhuma categoria encontrada',
                            //     description:
                            //         'Cadastre categorias para organizar seus produtos.',
                            // }}
                        />
                    </section>
                </PageCard>
            </PageContainer>

            {confirmOpen && (
                <ConfirmModal
                    open={confirmOpen}
                    title="Excluir categoria"
                    description="Esta ação não poderá ser desfeita. Deseja continuar?"
                    confirmText="Excluir"
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                />
            )}

            <CategoryFormModal
                open={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                category={selectedCategory}
                parents={parents}
            />
        </>
    );
}

CategoriesIndex.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);