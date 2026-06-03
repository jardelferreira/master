import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { PageContainer } from '@/pages/components/PageContainer';
import { useState } from 'react';
import {
    Layers,
    Pencil,
    FolderTree,
    Package,
    Hash,
    FileText,
    ChevronRight,
} from 'lucide-react';

import type { PageProps } from '@/types/inertia';
import type { CategoryShowData } from '@/types/category';
import CategoryFormModal from '@/pages/components/categories/CategoryFormModal';

type ParentCategory = {
    id: number;
    name: string;
    parent_id?: number | null;
};

type CategoryShowPageProps = PageProps &
    CategoryShowData & {
        parents: ParentCategory[];
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

export default function CategoryShow() {
    const {
        category,
        stats,
        breadcrumbs,
        children,
        products,
        parents,
    } = usePage<CategoryShowPageProps>().props;

    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <Head title={`Categoria · ${category.name}`} />

            <PageContainer>
                <div className="space-y-3">
                    {/* Header */}
                    <div className="bg-white border border-blue-200 rounded-2xl px-6 py-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-semibold text-zinc-900">
                                    {category.name}
                                </h1>

                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${category.active
                                        ? 'bg-emerald-500/20 text-emerald-700'
                                        : 'bg-red-500/20 text-red-700'
                                        }`}
                                >
                                    {category.active
                                        ? 'Ativa'
                                        : 'Inativa'}
                                </span>
                            </div>

                            <p className="text-sm font-mono text-zinc-400">
                                {category.slug}
                            </p>

                            {/* Breadcrumbs */}
                            <div className="flex flex-wrap items-center gap-1 text-sm text-zinc-500">
                                {breadcrumbs.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-1"
                                    >
                                        <span>{item.name}</span>

                                        {index <
                                            breadcrumbs.length - 1 && (
                                                <ChevronRight
                                                    size={14}
                                                />
                                            )}
                                    </div>
                                ))}
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard
                            label="Subcategorias"
                            value={String(stats.total_children)}
                            color="text-blue-700"
                        />

                        <StatCard
                            label="Produtos"
                            value={String(stats.total_products)}
                            color="text-zinc-500"
                        />

                        <StatCard
                            label="Tipo"
                            value={
                                stats.is_root
                                    ? 'Raiz'
                                    : 'Subcategoria'
                            }
                            color="text-purple-700"
                        />

                        <StatCard
                            label="Hierarquia"
                            value={
                                stats.has_children
                                    ? 'Com filhos'
                                    : 'Final'
                            }
                            color="text-amber-700"
                        />
                    </div>

                    {/* Body */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Main */}
                        <div className="lg:col-span-2 space-y-3">
                            {/* Subcategorias */}
                            <div className={`${tk.card} p-4`}>
                                <p className={tk.sectionTitle}>
                                    Subcategorias
                                </p>

                                <div className="mt-4 space-y-2">
                                    {children.length === 0 ? (
                                        <p className="text-sm italic text-zinc-400">
                                            Nenhuma subcategoria
                                            cadastrada.
                                        </p>
                                    ) : (
                                        children.map((child) => (
                                            <Link
                                                key={child.id}
                                                href={route('admin.categories.show', child.id)}
                                                className="flex items-center justify-between rounded-xl border border-zinc-100 px-4 py-3 hover:border-blue-200 hover:bg-blue-50/40 transition-colors cursor-pointer"
                                            >
                                                <div>
                                                    <p className="font-medium text-zinc-900">
                                                        {child.name}
                                                    </p>

                                                    <p className="text-xs text-zinc-400">
                                                        {child.slug}
                                                    </p>
                                                </div>

                                                <div className="text-right text-xs text-zinc-500">
                                                    <p>{child.products_count} produtos</p>
                                                    <p>{child.children_count} filhos</p>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Produtos */}
                            <div className={`${tk.card} p-4`}>
                                <p className={tk.sectionTitle}>
                                    Produtos vinculados
                                </p>

                                <div className="mt-4 space-y-2">
                                    {products.length === 0 ? (
                                        <p className="text-sm italic text-zinc-400">
                                            Nenhum produto
                                            vinculado.
                                        </p>
                                    ) : (
                                        products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between rounded-xl border border-zinc-100 px-4 py-3"
                                            >
                                                <div>
                                                    <p className="font-medium text-zinc-900">
                                                        {
                                                            product.name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-zinc-400">
                                                        {product.sku ??
                                                            'Sem SKU'}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`text-xs font-semibold ${product.active
                                                        ? 'text-emerald-600'
                                                        : 'text-red-500'
                                                        }`}
                                                >
                                                    {product.active
                                                        ? 'Ativo'
                                                        : 'Inativo'}
                                                </span>
                                            </div>
                                        ))
                                    )}
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
                                    Detalhes da categoria
                                </p>

                                <InfoRow
                                    icon={<Layers size={14} />}
                                    label="Nome"
                                    value={category.name}
                                />

                                <InfoRow
                                    icon={<Hash size={14} />}
                                    label="Slug"
                                    value={category.slug}
                                />

                                <InfoRow
                                    icon={<FolderTree size={14} />}
                                    label="Categoria Pai"
                                    value={
                                        category.parent?.name ??
                                        'Categoria raiz'
                                    }
                                />

                                <InfoRow
                                    icon={<FileText size={14} />}
                                    label="Descrição"
                                    value={
                                        category.description ??
                                        'Sem descrição'
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>

            <CategoryFormModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                category={category}
                parents={parents}
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

CategoryShow.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);