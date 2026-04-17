import React from "react";
import { usePermission } from "@/hooks/usePermission";
import { Head, Link, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { FileLock2, Pencil, Plus, Trash2, User2 } from "lucide-react";
import { DataTable } from "@/pages/components/DataTable";
import DashboardLayout from "@/pages/layouts/dashboard/DashboardLayout";

import { PageContainer } from "@/pages/components/PageContainer";
import { PageCard } from "@/pages/components/PageCard";

type Permission = {
    id: number;
    name: string;
    description: string
}

export default function PermissionsIndex() {
    const { can } = usePermission()
    const { permissions } = usePage<{ permissions: Permission[] }>().props


    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: 'id',
            header: "#",
            meta: {
                className: 'w-20 text-center font-medium'
            },
        },
        {
            accessorKey: 'name',
            header: 'Nome'
        },
        {
            accessorKey: 'description',
            header: 'Descrição'
        },
        {
            id: 'actions',
            header: "Ações",
            meta: {
                className: 'min-w-24 text-center'
            },
            cell: ({ row }) => {
                const permission = row.original

                if (!can('permissions.update') && can('permissions.delete')) {
                    return null
                }
                return (
                    <div className="flex text-center gap-2">
                        {can('permissions.update') && (
                            <Link
                                href={route('admin.users', permission.id)}
                                className="p-2 rounded-md hover:bg-base-100"
                                title="Editar"
                            >
                                <Pencil className="h-4 w-4 text-core-600" />
                            </Link>
                        )}
                        {can('permissions.manager') && (
                            <button
                                onClick={() => { }}
                                className="p-2 rounded-md hover:bg-red-50 cursor-pointer"
                                title="Vinculos"
                            >
                                <User2 className="h-4 w-4 text-blue-600" />
                            </button>
                        )}
                        {can('roles-manager') && (
                            <button
                                onClick={() => { }}
                                className="p-2 rounded-md hover:bg-red-50 cursor-pointer"
                                title="Funções"
                            >
                                <FileLock2 className="h-4 w-4 text-blue-600" />
                            </button>
                        )}
                    </div>
                )
            }
        }
    ]

    return (
        <>
            <Head title="Permissões" />
            <PageContainer>
                <PageCard>
                    <DataTable<Permission>
                        data={permissions}
                        columns={columns}
                        searchPlaceholder="Pesquisar por permissões"
                        headerActions={[
                            {
                                type: 'link',
                                href: route('admin.users.create'),
                                label: 'Cadastrar',
                                icon: <Plus className="h-4 w-4" />
                            }
                        ]}
                    />
                </PageCard>
            </PageContainer>

        </>
    )

}

PermissionsIndex.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
)