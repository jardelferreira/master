import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import {PageContainer} from '@/pages/components/PageContainer';
import {PageCard} from '@/pages/components/PageCard';
import ConfirmModal from '@/pages/components/ConfirmModal';
import { DataTable } from '@/pages/components/DataTable';

import EmployeeFormModal from '@/pages/components/employees/EmployeeFormModal';
import { buildColumns } from '@/pages/components/employees/Columns';
import type { Employee } from '@/types/employee';
import type { SelectOption } from '@/types/select-option';

type Props = {
    employees: Employee[];

    companies: SelectOption[];
    occupations: SelectOption[];
};

export default function Index({
    employees,
    companies,
    occupations,
}: Props) {
    const [openForm, setOpenForm] =
        useState(false);

    const [editingEmployee, setEditingEmployee] =
        useState<Employee | null>(null);

    const [deletingEmployee, setDeletingEmployee] =
        useState<Employee | null>(null);

    const columns = useMemo(
        () =>
            buildColumns({
                onEdit: (
                    employee,
                ) => {
                    setEditingEmployee(
                        employee,
                    );

                    setOpenForm(
                        true,
                    );
                },

                onDelete: (
                    employee,
                ) => {
                    setDeletingEmployee(
                        employee,
                    );
                },
            }),
        [],
    );

    function createEmployee() {
        setEditingEmployee(null);
        setOpenForm(true);
    }

    function destroyEmployee() {
        if (!deletingEmployee) {
            return;
        }

        router.delete(
            route(
                'admin.settings.employees.destroy',
                deletingEmployee.id,
            ),
            {
                preserveScroll: true,

                onSuccess: () =>
                    setDeletingEmployee(
                        null,
                    ),
            },
        );
    }

    return (
        <DashboardLayout>
            <Head title="Colaboradores" />

            <PageContainer>
                <PageCard>
                    <div className="mb-4">
                        <h1 className="text-lg font-semibold">Colaboradores</h1>
                        <p className="text-sm text-slate-500">
                            Gerencie Seus Colaboradores
                        </p>
                    </div>
                    <DataTable
                        data={employees}
                        columns={columns}
                        searchPlaceholder="Buscar colaborador..."
                        exportFileName="colaboradores"
                        enableExport
                        headerActions={[
                            {
                                permissions: [],
                                type: 'button',
                                label:
                                    'Novo Colaborador',
                                icon: (
                                    <Plus
                                        size={
                                            16
                                        }
                                    />
                                ),
                                onClick:
                                    createEmployee,
                            },
                        ]}
                    />
                </PageCard>
            </PageContainer>

            <EmployeeFormModal
                open={openForm}
                onClose={() =>
                    setOpenForm(false)
                }
                employee={
                    editingEmployee
                }
                companies={
                    companies
                }
                occupations={
                    occupations
                }
            />

            <ConfirmModal
                open={
                    !!deletingEmployee
                }
                title="Excluir colaborador"
                description="Deseja realmente excluir este colaborador?"
                onClose={() =>
                    setDeletingEmployee(
                        null,
                    )
                }
                onConfirm={ destroyEmployee }
            />
        </DashboardLayout>
    );
}