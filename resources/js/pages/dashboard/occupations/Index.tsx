import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';

import { PageContainer } from '@/pages/components/PageContainer';
import {PageCard} from '@/pages/components/PageCard';
import ConfirmModal from '@/pages/components/ConfirmModal';

import { DataTable } from '@/pages/components/DataTable';

import OccupationFormModal from '@/pages/components/occupations/OccupationFormModal';

import { buildColumns } from '@/pages/components/occupations/Columns';
import type { Occupation } from '@/types/occupation';

type Props = {
    occupations: Occupation[];
};

export default function Index({
    occupations,
}: Props) {
    const [openForm, setOpenForm] =
        useState(false);

    const [editingOccupation, setEditingOccupation] =
        useState<Occupation | null>(null);

    const [deletingOccupation, setDeletingOccupation] =
        useState<Occupation | null>(null);

    const columns = useMemo(
        () =>
            buildColumns({
                onEdit: (
                    occupation,
                ) => {
                    setEditingOccupation(
                        occupation,
                    );

                    setOpenForm(
                        true,
                    );
                },

                onDelete: (
                    occupation,
                ) => {
                    setDeletingOccupation(
                        occupation,
                    );
                },
            }),
        [],
    );

    function createOccupation() {
        setEditingOccupation(null);
        setOpenForm(true);
    }

    function destroyOccupation() {
        if (!deletingOccupation) {
            return;
        }

        router.delete(
            route(
                'admin.settings.occupations.destroy',
                deletingOccupation.id,
            ),
            {
                preserveScroll: true,

                onSuccess: () =>
                    setDeletingOccupation(
                        null,
                    ),
            },
        );
    }

    return (
        <DashboardLayout>
            <Head title="Ocupações" />

            <PageContainer>
                <PageCard>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Ocupações</h3>
                        <p className="text-sm text-muted-foreground">Gerencie as ocupações dos colaboradores.</p>
                    </div>

                    <DataTable
                        data={
                            occupations
                        }
                        columns={
                            columns
                        }
                        searchPlaceholder="Buscar ocupação..."
                        exportFileName="ocupacoes"
                        enableExport
                        headerActions={[
                            {
                                type: 'button',
                                label:
                                    'Nova Ocupação',
                                icon: (
                                    <Plus
                                        size={
                                            16
                                        }
                                    />
                                ),
                                onClick:
                                    createOccupation,
                                permissions:
                                    [
                                        'occupations.create',
                                    ],
                            },
                        ]}
                    />
                </PageCard>
            </PageContainer>

            <OccupationFormModal
                open={openForm}
                onClose={() =>
                    setOpenForm(false)
                }
                occupation={
                    editingOccupation
                }
            />

            <ConfirmModal
                open={
                    !!deletingOccupation
                }
                title="Excluir ocupação"
                description="Deseja realmente excluir esta ocupação?"
                onClose={() =>
                    setDeletingOccupation(
                        null,
                    )
                }
                onConfirm={
                    destroyOccupation
                }
            />
        </DashboardLayout>
    );
}