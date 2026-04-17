import { Head, usePage, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';
import InviteUserModal from '@/pages/components/users/InviteUserModal';

import {
    Mail,
    Pencil,
    Plus,
    ShieldCheck,
    Sparkles,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/pages/components/ConfirmModal';
import { usePermission } from '@/hooks/usePermission';
import type { PageProps } from '@/types/inertia';
import { ToggleUser } from '@/components/ui/ToggleControl';
import { PageCard } from '@/pages/components/PageCard';
import { PageContainer } from '@/pages/components/PageContainer';
import { permissions } from '@/routes/admin';


type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    active: boolean;
};

type UsersPageProps = PageProps & {
    users: User[];
    emailVerificationEnabled: boolean;
};

export default function UsersIndex() {
    const { users, auth, emailVerificationEnabled } = usePage<UsersPageProps>().props;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [inviteOpen, setInviteOpen] = useState(false);
    const { can } = usePermission();

    function openDeleteModal(userId: number) {
        setSelectedUserId(userId);
        setConfirmOpen(true);
    }

    function closeDeleteModal() {
        setConfirmOpen(false);
        setSelectedUserId(null);
    }

    function confirmDelete() {
        if (!selectedUserId) return;

        router.delete(route('admin.users.destroy', selectedUserId), {
            onFinish: closeDeleteModal,
        });
    }

    const allColumns: ColumnDef<User>[] = [
        {
            accessorKey: 'id',
            header: '#',
            meta: {
                className: 'w-20 text-cent font-medium',
            },
        },
        {
            accessorKey: 'name',
            header: 'Nome',
        },
        {
            accessorKey: 'email',
            header: 'E-mail',
        },
        {
            accessorKey: 'active',
            header: "Status",
            cell: ({ row, getValue }) => {
                const user = row.original;
                const value = getValue<boolean>();

                if (!can('users.update')) {
                    return value ? (
                        <p className="text-green-500 font-bold">Ativo</p>
                    ) : (
                        <p className="text-red-500 font-bold">Inativo</p>
                    );
                }

                return (
                    <ToggleUser
                        initialValue={value}
                        onChange={async (newValue) => {
                            // 👉 você controla o backend aqui
                            await router.post(route('admin.users.toggleStatus', user.id), {}, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    router.reload({ only: ['users', 'flash'] });
                                }
                            });

                        }}
                    />
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Criado em',
            cell: ({ getValue }) =>
                new Date(getValue<string>()).toLocaleDateString('pt-BR'),
        },
        {
            id: 'actions',
            header: 'Ações',
            meta: {
                className: 'w-24 text-right',
            },
            cell: ({ row }) => {
                const user = row.original;

                if (!can('users.update') && !can('users.delete')) {
                    return null;
                }

                return (
                    <div className="flex justify-end gap-2">
                        {can('users.update') && (
                            <Link
                                href={route('admin.users', user.id)}
                                className="rounded-md p-2 hover:bg-base-100"
                                title="Editar"
                            >
                                <Pencil className="h-4 w-4 text-core-600" />
                            </Link>
                        )}

                        {can('users.delete') && (
                            <button
                                onClick={() => openDeleteModal(user.id)}
                                className="cursor-pointer rounded-md p-2 hover:bg-red-50"
                                title="Excluir"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    // Filtro de coluna

    const columns = allColumns.filter((col: any) => {
        // coluna status
        if (col.accessorKey === 'active') {
            return can('users.update');
        }

        // coluna ações
        if (col.id === 'actions') {
            return can('users.update') || can('users.delete') || can('users.manager');
        }

        return true;
    });

    return (
        <>
            <Head title="Usuários" />

            {emailVerificationEnabled ? (
                <InviteUserModal
                    open={inviteOpen}
                    onClose={() => setInviteOpen(false)}
                />
            ) : null}
            <PageContainer>
                <PageCard>
                    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
                        <DataTable<User>
                            data={users}
                            columns={columns}
                            searchPlaceholder="Buscar usuarios por nome ou e-mail..."
                            headerActions={[
                                {
                                    permissions: ['users.manager', 'users.create'],
                                    type: 'link',
                                    href: route('admin.users.create'),
                                    label: 'Cadastro',
                                    icon: <Plus className="h-4 w-4" />,
                                    className:
                                        'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] border-0 hover:opacity-95',
                                },
                                ...(emailVerificationEnabled
                                    ? [
                                        {
                                            permissions: 'users.manager',
                                            type: 'button' as const,
                                            onClick: () =>
                                                setInviteOpen(true),
                                            label: 'Convidar',
                                            icon: (
                                                <Mail className="h-4 w-4" />
                                            ),
                                            className:
                                                'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100',
                                        },
                                    ]
                                    : []),
                            ]}
                        />
                    </section>
                </PageCard>
            </PageContainer>


            <ConfirmModal
                open={confirmOpen}
                title="Excluir usuário"
                description="Esta ação não poderá ser desfeita. Deseja continuar?"
                confirmText="Excluir"
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />
        </>
    );
}

UsersIndex.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
