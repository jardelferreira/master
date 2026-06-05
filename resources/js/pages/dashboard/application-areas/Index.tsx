import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';

import { PageContainer } from '@/pages/components/PageContainer';
import { PageCard } from '@/pages/components/PageCard';

import ConfirmModal from '@/pages/components/ConfirmModal';
import { DataTable } from '@/pages/components/DataTable';

import ApplicationAreaFormModal from '@/pages/components/application-areas/ApplicationAreaFormModal';

import { buildColumns } from '@/pages/components/application-areas/Columns';

import type {
    ApplicationArea,
    ApplicationAreaPageProps,
} from '@/types/application-area';

export default function Index({
    applicationAreas,
    parentAreas,
}: ApplicationAreaPageProps) {
    const [openForm, setOpenForm] =
        useState(false);

    const [
        editingArea,
        setEditingArea,
    ] =
        useState<ApplicationArea | null>(
            null,
        );

    const [
        deletingArea,
        setDeletingArea,
    ] =
        useState<ApplicationArea | null>(
            null,
        );

    const columns = useMemo(
        () =>
            buildColumns({
                onEdit: (
                    area,
                ) => {
                    setEditingArea(
                        area,
                    );

                    setOpenForm(
                        true,
                    );
                },

                onDelete: (
                    area,
                ) =>
                    setDeletingArea(
                        area,
                    ),
            }),
        [],
    );

    function destroyArea() {
        if (!deletingArea) {
            return;
        }

        router.delete(
            route(
                'admin.settings.application-areas.destroy',
                deletingArea.id,
            ),
            {
                preserveScroll: true,

                onSuccess: () =>
                    setDeletingArea(
                        null,
                    ),
            },
        );
    }

    function closeForm() {
        setOpenForm(false);

        setEditingArea(
            null,
        );
    }

    return (
        <DashboardLayout>
            <Head
                title="Áreas de Aplicação"
            />

            <PageContainer>
                <PageCard>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">
                            Áreas de Aplicação
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Gerencie as áreas de aplicação utilizadas
                            nos projetos.
                        </p>
                    </div>

                    <DataTable
                        data={
                            applicationAreas
                        }
                        columns={
                            columns
                        }
                        searchPlaceholder="Buscar área..."
                        exportFileName="areas-aplicacao"
                        enableExport
                        headerActions={[
                            {
                                permissions:
                                    [],
                                type: 'button',
                                label:
                                    'Nova Área',
                                icon: (
                                    <Plus
                                        size={
                                            16
                                        }
                                    />
                                ),
                                onClick:
                                    () => {
                                        setEditingArea(
                                            null,
                                        );

                                        setOpenForm(
                                            true,
                                        );
                                    },
                            },
                        ]}
                    />
                </PageCard>
            </PageContainer>

            <ApplicationAreaFormModal
                open={
                    openForm
                }
                onClose={
                    closeForm
                }
                applicationArea={
                    editingArea
                }
                parentAreas={
                    parentAreas
                }
            />

            <ConfirmModal
                open={
                    !!deletingArea
                }
                title="Remover área"
                description={`Deseja remover a área "${deletingArea?.name}"?`}
                onClose={() =>
                    setDeletingArea(
                        null,
                    )
                }
                onConfirm={
                    destroyArea
                }
            />
        </DashboardLayout>
    );
}