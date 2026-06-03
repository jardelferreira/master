import { Head, usePage, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';
import { PageCard } from '@/pages/components/PageCard';
import { PageContainer } from '@/pages/components/PageContainer';
import ConfirmModal from '@/pages/components/ConfirmModal';
import { usePermission } from '@/hooks/usePermission';
import { ToggleUser } from '@/components/ui/ToggleControl';
import { Plus, Pencil, Trash2, Globe, Phone, Mail, Eye } from 'lucide-react';
import { useState } from 'react';
import type { PageProps } from '@/types/inertia';
import ProviderFormModal from '@/pages/components/providers/ProviderFormModal';

export type Provider = {
    id: number;
    uuid: string;
    name: string;
    trade_name: string | null;
    document: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    contact_name: string | null;
    city: string | null;
    state: string | null;
    active: boolean;
    meta: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

type ProvidersPageProps = PageProps & {
    providers: Provider[];
};

export default function ProvidersIndex() {
    const { providers } = usePage<ProvidersPageProps>().props;
    const { can } = usePermission();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

    function openDeleteModal(id: number) {
        setSelectedProviderId(id);
        setConfirmOpen(true);
    }

    function closeDeleteModal() {
        setConfirmOpen(false);
        setSelectedProviderId(null);
    }

    function confirmDelete() {
        if (!selectedProviderId) return;
        router.delete(route('admin.providers.destroy', selectedProviderId), {
            onFinish: closeDeleteModal,
        });
    }

    function openCreateModal() {
        setSelectedProvider(null);
        setFormModalOpen(true);
    }

    function openEditModal(provider: Provider) {
        setSelectedProvider(provider);
        setFormModalOpen(true);
    }

    const columns: ColumnDef<Provider>[] = [
        {
            accessorKey: 'id',
            header: '#',
            meta: { className: 'w-16 font-medium' },
        },
        {
            id: 'display_name',
            header: 'Fornecedor',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div>
                        <p className="font-medium text-base-900">
                            {p.trade_name || p.name}
                        </p>
                        {p.trade_name && (
                            <p className="text-xs text-base-400">{p.name}</p>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'document',
            header: 'CNPJ / CPF',
            cell: ({ getValue }) => getValue<string>() ?? <span className="text-base-300">—</span>,
        },
        {
            id: 'contact',
            header: 'Contato',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div className="flex flex-col gap-0.5 text-sm">
                        {p.email && (
                            <span className="flex items-center gap-1 text-base-600">
                                <Mail size={13} className="text-base-400" />
                                {p.email}
                            </span>
                        )}
                        {p.phone && (
                            <span className="flex items-center gap-1 text-base-600">
                                <Phone size={13} className="text-base-400" />
                                {p.phone}
                            </span>
                        )}
                        {!p.email && !p.phone && (
                            <span className="text-base-300">—</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'location',
            header: 'Cidade / UF',
            cell: ({ row }) => {
                const p = row.original;
                if (!p.city && !p.state) return <span className="text-base-300">—</span>;
                return (
                    <span className="text-sm text-base-600">
                        {[p.city, p.state].filter(Boolean).join(' / ')}
                    </span>
                );
            },
        },
        {
            accessorKey: 'active',
            header: 'Status',
            cell: ({ row, getValue }) => {
                const provider = row.original;
                const value = getValue<boolean>();

                if (!can('providers.update')) {
                    return value ? (
                        <p className="text-green-500 font-bold">Ativo</p>
                    ) : (
                        <p className="text-red-500 font-bold">Inativo</p>
                    );
                }

                return (
                    <ToggleUser
                        initialValue={value}
                        onChange={async () => {
                            await router.post(
                                route('admin.providers.toggleStatus', provider.id),
                                {},
                                {
                                    preserveScroll: true,
                                    onSuccess: () => router.reload({ only: ['providers', 'flash'] }),
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
                const provider = row.original;

                if (!can('providers.update') && !can('providers.delete')) return null;

                return (
                    <div className="flex justify-end gap-2">
                        {can('providers.update') && (
                            <button
                                onClick={() => openEditModal(provider)}
                                className="rounded-md p-2 hover:bg-base-100 cursor-pointer"
                                title="Editar fornecedor"
                            >
                                <Pencil className="h-4 w-4 text-core-600" />
                            </button>
                        )}
                        {can('providers.delete') && (
                            <button
                                onClick={() => openDeleteModal(provider.id)}
                                className="rounded-md p-2 hover:bg-red-50 cursor-pointer"
                                title="Excluir"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                        )}
                        {can('providers.view') && (
                            <a
                              href={route('admin.providers.show',provider.id)}  
                                className="rounded-md p-2 hover:bg-blue-50 cursor-pointer"
                                title="Excluir"
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
            <Head title="Fornecedores" />

            <PageContainer>
                <PageCard>
                    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
                        <DataTable<Provider>
                            data={providers}
                            columns={columns}
                            searchPlaceholder="Buscar fornecedor por nome, documento ou cidade..."
                            headerActions={[
                                {
                                    permissions: ['providers.create', 'providers.manager'],
                                    type: 'button',
                                    onClick: openCreateModal,
                                    label: 'Novo Fornecedor',
                                    icon: <Plus className="h-5 w-5" />,
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
                    title="Excluir fornecedor"
                    description="Esta ação não poderá ser desfeita. Deseja continuar?"
                    confirmText="Excluir"
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                />
            )}

            <ProviderFormModal
                open={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                provider={selectedProvider}
            />
        </>
    );
}

ProvidersIndex.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);