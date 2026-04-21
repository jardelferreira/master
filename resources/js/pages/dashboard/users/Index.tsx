import { Head, usePage, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';
import InviteUserModal from '@/pages/components/users/InviteUserModal';

import {
    Cog,
    Mail,
    Plus,
    ShieldCheck,
    ShieldOff,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/pages/components/ConfirmModal';
import { usePermission } from '@/hooks/usePermission';
import { ToggleUser } from '@/components/ui/ToggleControl';
import { PageCard } from '@/pages/components/PageCard';
import { PageContainer } from '@/pages/components/PageContainer';
import UserActionsModal from '@/pages/components/users/UserActionsModal';
import type { UsersPageProps, User } from '@/types/user';
import InvitationsModal from '@/pages/components/users/InvitationsModal';

export default function UsersIndex() {
    const { users, emailVerificationEnabled } = usePage<UsersPageProps>().props;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmToggleVerifyOpen, setConfirmToggleVerifyOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [invitationsModalOpen, setInvitationsModalOpen] = useState(false);
    const [userOptionsModal, setUserOptionsModal] = useState(false);


    const [selectedUser, setSelectedUser] = useState<User>();
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

    function confirmToggleVerifyEmail() {
        if (!selectedUserId) return;
        router.post(route('admin.users.toggleverify', selectedUserId), {}, {
            onFinish: () => setConfirmToggleVerifyOpen(false)
        })
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
            accessorKey: 'created_at',
            header: 'Criado em',
            cell: ({ getValue }) =>
                new Date(getValue<string>()).toLocaleDateString('pt-BR'),
        },
        {
            accessorKey: 'email_verified_at',
            header: 'E-mail Verificado',
            cell: ({ row }) => {
                const user = row.original;

                const isVerified = !!user.email_verified_at;

                function handleToggle() {
                    const action = isVerified ? 'remover verificação' : 'verificar';
                    setSelectedUserId(user.id)
                    setConfirmToggleVerifyOpen(true)
                }

                return (
                    <div className="flex items-center gap-2 cursor-point">

                        {/* STATUS */}
                        {isVerified
                            ? <ShieldCheck className="text-emerald-600" size={20} />
                            : <ShieldOff className="text-amber-500" size={20} />
                        }

                        {/* AÇÃO */}
                        <button
                            onClick={handleToggle}
                            className={`text-sm px-2 py-1 rounded-lg transition cursor-pointer 
                                ${isVerified ? 'bg-green-200' : 'bg-red-200'

                                }
                                `}
                        >
                            {isVerified ? 'Reverter' : 'Verificar'}
                        </button>
                        <span>{user.email_verified_at}</span>

                    </div>
                );
            }
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
                            <button
                                onClick={() => {
                                    setSelectedUser(user)
                                    setUserOptionsModal(true)
                                }}
                                className="rounded-md p-2 hover:bg-base-100 cursor-pointer"
                                title="Confg. do Usuário"
                            >
                                <Cog className="h-5 w-5 text-core-600"></Cog>
                            </button>
                        )}

                        {can('users.delete') && (
                            <button
                                onClick={() => openDeleteModal(user.id)}
                                className="rounded-md p-2 hover:bg-red-50 cursor-pointer"
                                title="Excluir"
                            >
                                <Trash2 className="h-5 w-5 text-red-600" />
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
                                    icon: <Plus className="h-5 w-5" />,
                                    className:
                                        'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] border-0 hover:opacity-95',
                                },
                                {
                                    permissions: ['users.manager', 'users.create'],
                                    type: 'button',
                                    onClick: () => setInvitationsModalOpen(true),
                                    label: 'Convites',
                                    icon: <UserPlus className="h-5 w-5" />,
                                    className:
                                        'bg-gradient-to-r from-green-700 to-green-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] border-0 hover:opacity-95',
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
                                                <Mail className="h-5 w-5" />
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

            {confirmOpen &&
                <ConfirmModal
                    open={confirmOpen}
                    title="Excluir usuário"
                    description="Esta ação não poderá ser desfeita. Deseja continuar?"
                    confirmText="Excluir"
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                />
            }
            {confirmToggleVerifyOpen &&
                <ConfirmModal
                    open={confirmToggleVerifyOpen}
                    title="Alterar Verificação de e-mail"
                    description="Esta ação pode limitar o acesso ao sistema."
                    confirmText="Mudar verificação"
                    onClose={() => setConfirmToggleVerifyOpen(false)}
                    onConfirm={confirmToggleVerifyEmail}
                />
            }
            {selectedUser && <UserActionsModal
                open={userOptionsModal}
                onClose={() => setUserOptionsModal(false)}
                user={selectedUser}
            ></UserActionsModal>

            }
            {invitationsModalOpen && <InvitationsModal
                open={invitationsModalOpen}
                onClose={() => setInvitationsModalOpen(false)}
            ></InvitationsModal>
            }

        </>
    );
}

UsersIndex.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
