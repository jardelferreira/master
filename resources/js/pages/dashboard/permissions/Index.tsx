import React, { useState } from "react";
import { usePermission } from "@/hooks/usePermission";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import {
    FileLock2,
    Pencil,
    Plus,
    Trash2,
    User2,
    ShieldCheck,
} from "lucide-react";

import { DataTable } from "@/pages/components/DataTable";
import DashboardLayout from "@/pages/layouts/dashboard/DashboardLayout";
import { PageContainer } from "@/pages/components/PageContainer";
import { PageCard } from "@/pages/components/PageCard";
import ConfirmModal from "@/pages/components/ConfirmModal";

// 🔥 novos modais (criar depois)
import PermissionUsersModal from "@/pages/components/permissions/PermissionUsersModal";
import PermissionRolesModal from "@/pages/components/permissions/PermissionRolesModal";

import type { SimpleUser } from "@/types/user";
import type { Role } from "@/pages/components/permissions/PermissionRolesModal";
import PermissionEditModal from "@/pages/components/permissions/PermissionEditModal";
import PermissionCreateModal from "@/pages/components/permissions/PermissionCreateModal";
import { create } from "@/routes/admin/users";

type Permission = {
    id: number;
    name: string;
    description: string;
    users: SimpleUser[]
    roles: Role[]
};


export default function PermissionsIndex() {
    const { can } = usePermission();
    const { permissions, users, roles } = usePage<{ permissions: Permission[], users: SimpleUser[], roles: Role[] }>().props;
    const [selected, setSelected] = useState<Permission | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [usersOpen, setUsersOpen] = useState(false);
    const [rolesOpen, setRolesOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false)
    const [createOpen, setCreateOpen] = useState(false)


    function openDelete(permission: Permission) {
        setSelected(permission);
        setDeleteOpen(true);
    }

    function confirmDelete() {
        if (!selected) return;

        router.delete(route("admin.permissions.destroy", selected.id), {
            onFinish: () => {
                setDeleteOpen(false);
                setSelected(null);
            },
        });
    }

    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: "id",
            header: "#",
            meta: {
                className: "w-16 text-center font-medium",
            },
        },
        {
            accessorKey: "name",
            header: "Permissão",
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-slate-800">
                        {getValue<string>()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "description",
            header: "Descrição",
            cell: ({ getValue }) => (
                <span className="text-sm text-slate-500">
                    {getValue<string>() || "—"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Ações",
            meta: {
                className: "w-36 text-right",
            },
            cell: ({ row }) => {
                const permission = row.original;

                if (
                    !can("permissions.update") &&
                    !can("permissions.delete") &&
                    !can("permissions.manager")
                ) {
                    return null;
                }

                return (
                    <div className="flex justify-end gap-2">

                        {can("permissions.update") && (
                            <button
                                onClick={() => {
                                    setEditOpen(true)
                                    setSelected(permission)
                                }}
                                className="cursor-pointer p-2 rounded-md hover:bg-slate-100 transition"
                                title="Editar"
                            >
                                <Pencil className="h-5 w-5 text-blue-600" />
                            </button>

                        )}
                        {can("permissions.manager") && (
                            <button
                                onClick={() => {
                                    setSelected(permission);
                                    setUsersOpen(true);
                                }}
                                className="p-2 cursor-pointer rounded-md hover:bg-blue-50 transition"
                                title="Usuários vinculados"
                            >
                                <User2 className="h-5 w-5 text-blue-600" />
                            </button>
                        )}

                        {can("roles.manager") && (
                            <button
                                onClick={() => {
                                    setSelected(permission);
                                    setRolesOpen(true);
                                }}
                                className="p-2 cursor-pointer rounded-md hover:bg-indigo-50 transition"
                                title="Funções vinculadas"
                            >
                                <FileLock2 className="h-5 w-5 text-indigo-600" />
                            </button>
                        )}

                        {can("permissions.delete") && (
                            <button
                                onClick={() => openDelete(permission)}
                                className="p-2 cursor-pointer rounded-md hover:bg-red-50 transition"
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

    return (
        <>
            <Head title="Permissões" />

            <PageContainer>
                <PageCard>
                    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">

                        <DataTable<Permission>
                            data={permissions}
                            columns={columns}
                            searchPlaceholder="Buscar permissões..."
                            headerActions={[
                                {
                                    permissions: ["permissions.create"],
                                    type: "button" as const,
                                    onClick: () => setCreateOpen(true),
                                    label: "Nova Permissão",
                                    icon: <Plus className="h-4 w-4" />,
                                    className:
                                        "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] border-0 hover:opacity-95",
                                },
                            ]}
                        />
                    </section>
                </PageCard>
            </PageContainer>

            {/* 🔥 DELETE */}
            <ConfirmModal
                open={deleteOpen}
                title="Excluir permissão"
                description="Essa ação não pode ser desfeita."
                confirmText="Excluir"
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
            />

            {/* 🔥 USERS */}
            {selected && usersOpen && (
                <PermissionUsersModal
                    open={usersOpen}
                    onClose={() => {
                        setUsersOpen(false);
                        setSelected(null);
                    }}
                    permission={selected}
                    users={users}
                    assigned={selected.users?.map(u => u.id) || []}
                />
            )}

            {/* ROLES */}
            {selected && rolesOpen && (
                <PermissionRolesModal
                    open={rolesOpen}
                    onClose={() => {
                        setRolesOpen(false);
                        setSelected(null);
                    }}
                    permission={selected} // 🔥 corrigido
                    roles={roles}
                    assigned={selected.roles?.map(u => u.id) || []}
                />
            )}

            {/*Edit Permissions modal */}
            {selected && editOpen && (
                <PermissionEditModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    permission={selected}
                ></PermissionEditModal>
            )}
            {/* Create Permission model */}
            {createOpen && (
                <PermissionCreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                ></PermissionCreateModal>
            )}
        </>
    );
}

PermissionsIndex.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);