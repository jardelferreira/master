import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';

import { PageContainer } from '@/pages/components/PageContainer';
import { PageCard } from '@/pages/components/PageCard';

import ConfirmModal from '@/pages/components/ConfirmModal';
import { DataTable } from '@/pages/components/DataTable';

import ProjectTeamFormModal from '@/pages/components/projects/ProjectTeamFormModal';

import { buildColumns } from '@/pages/components/projects/Columns';

import type {
    ProjectTeam,
    ProjectTeamPageProps,
} from '@/types/project-team';

export default function Index({
    project,
    teams,
    availableTeams,
}: ProjectTeamPageProps) {
    const [openForm, setOpenForm] =
        useState(false);

    const [
        deletingTeam,
        setDeletingTeam,
    ] =
        useState<ProjectTeam | null>(
            null,
        );

    const columns = useMemo(
        () =>
            buildColumns({
                onDelete: (
                    team,
                ) => {
                    setDeletingTeam(
                        team,
                    );
                },
            }),
        [],
    );

    function destroyTeam() {
        if (!deletingTeam) {
            return;
        }

        router.delete(
            route(
                'admin.projects.teams.destroy',
                [
                    project.id,
                    deletingTeam.id,
                ],
            ),
            {
                preserveScroll: true,

                onSuccess: () =>
                    setDeletingTeam(
                        null,
                    ),
            },
        );
    }

    return (
        <DashboardLayout>
            <Head
                title={`Equipes - ${project.name}`}
            />

            <PageContainer>
                <PageCard>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">
                            Equipes do Projeto
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Gerencie as equipes vinculadas ao projeto{' '}
                            <strong>
                                {
                                    project.name
                                }
                            </strong>
                            .
                        </p>
                    </div>

                    <DataTable
                        data={teams}
                        columns={columns}
                        searchPlaceholder="Buscar equipe..."
                        exportFileName={`projeto-${project.id}-equipes`}
                        enableExport
                        headerActions={[
                            {
                                permissions:
                                    [],
                                type: 'button',
                                label:
                                    'Vincular Equipe',
                                icon: (
                                    <Plus
                                        size={
                                            16
                                        }
                                    />
                                ),
                                onClick:
                                    () =>
                                        setOpenForm(
                                            true,
                                        ),
                            },
                        ]}
                    />
                </PageCard>
            </PageContainer>

            <ProjectTeamFormModal
                open={
                    openForm
                }
                onClose={() =>
                    setOpenForm(
                        false,
                    )
                }
                projectId={
                    project.id
                }
                availableTeams={
                    availableTeams
                }
            />

            <ConfirmModal
                open={
                    !!deletingTeam
                }
                title="Remover equipe"
                description={`Deseja remover a equipe "${deletingTeam?.name}" deste projeto?`}
                onClose={() =>
                    setDeletingTeam(
                        null,
                    )
                }
                onConfirm={
                    destroyTeam
                }
            />
        </DashboardLayout>
    );
}