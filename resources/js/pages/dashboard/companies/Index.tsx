import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { PageContainer } from '@/pages/components/PageContainer';
import {PageCard} from '@/pages/components/PageCard';
import ConfirmModal from '@/pages/components/ConfirmModal';
import { DataTable } from '@/pages/components/DataTable';

import CompanyFormModal from '@/pages/components/companies/CompanyFormModal';
import { buildColumns } from '@/pages/components/companies/Column';
import type { Company } from '@/types/company';

type Props = {
    companies: Company[];
};

export default function Index({
    companies,
}: Props) {
    const [openForm, setOpenForm] =
        useState(false);

    const [editingCompany, setEditingCompany] =
        useState<Company | null>(null);

    const [deletingCompany, setDeletingCompany] =
        useState<Company | null>(null);

    const columns = useMemo(
        () =>
            buildColumns({
                onEdit: (
                    company,
                ) => {
                    setEditingCompany(
                        company,
                    );

                    setOpenForm(
                        true,
                    );
                },

                onDelete: (
                    company,
                ) => {
                    setDeletingCompany(
                        company,
                    );
                },
            }),
        [],
    );

    function createCompany() {
        setEditingCompany(null);
        setOpenForm(true);
    }

    function destroyCompany() {
        if (!deletingCompany) {
            return;
        }

        router.delete(
            route(
                'admin.settings.companies.destroy',
                deletingCompany.id,
            ),
            {
                preserveScroll: true,

                onSuccess: () =>
                    setDeletingCompany(
                        null,
                    ),
            },
        );
    }

    return (
        <DashboardLayout>
            <Head title="Empresas" />

            <PageContainer>
                <PageCard>
                    <div className="mb-4">
                        <h1 className="text-lg font-semibold">Empresas</h1>
                        <p className="text-sm text-slate-500">
                            Gerencie empresas próprias e terceirizadas.
                        </p>
                    </div>
                    <DataTable
                        data={companies}
                        columns={columns}
                        searchPlaceholder="Buscar empresa..."
                        exportFileName="empresas"
                        enableExport
                        headerActions={[
                            {
                                permissions: [],
                                type: 'button',
                                label:
                                    'Nova Empresa',
                                icon: (
                                    <Plus
                                        size={
                                            16
                                        }
                                    />
                                ),
                                onClick:
                                    createCompany,
                            },
                        ]}
                    />
                </PageCard>
            </PageContainer>

            <CompanyFormModal
                open={openForm}
                onClose={() =>
                    setOpenForm(false)
                }
                company={
                    editingCompany
                }
            />

            <ConfirmModal
                open={
                    !!deletingCompany
                }
                title="Excluir empresa"
                description="Deseja realmente excluir esta empresa?"
                onClose={() =>
                    setDeletingCompany(
                        null,
                    )
                }
                onConfirm={destroyCompany}
            />
        </DashboardLayout>
    );
}