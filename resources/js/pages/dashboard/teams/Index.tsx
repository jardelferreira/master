    import { Head, router } from '@inertiajs/react';
    import { useMemo, useState } from 'react';
    import { Plus } from 'lucide-react';

    import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';

    import {PageContainer} from '@/pages/components/PageContainer';
    import {PageCard} from '@/pages/components/PageCard';
    import ConfirmModal from '@/pages/components/ConfirmModal';
    import { DataTable } from '@/pages/components/DataTable';

    import TeamFormModal from '@/pages/components/teams/TeamFormModal';
    import { buildColumns } from '@/pages/components/teams/Columns';

    import type {
        Team,
        TeamOption,
    } from '@/types/team';

    type Props = {
        teams: Team[];
        parentTeams: TeamOption[];
    };

    export default function Index({
        teams,
        parentTeams,
    }: Props) {
        const [openForm, setOpenForm] =
            useState(false);

        const [editingTeam, setEditingTeam] =
            useState<Team | null>(null);

        const [deletingTeam, setDeletingTeam] =
            useState<Team | null>(null);

        const columns = useMemo(
            () =>
                buildColumns({
                    onEdit: (team) => {
                        setEditingTeam(team);
                        setOpenForm(true);
                    },

                    onDelete: (team) => {
                        setDeletingTeam(team);
                    },

                    onManageMembers: (
                        team,
                    ) => {
                        router.visit(
                            route(
                                'admin.settings.teams.members.index',
                                team.id,
                            ),
                        );
                    },
                }),
            [],
        );

        function createTeam() {
            setEditingTeam(null);
            setOpenForm(true);
        }

        function destroyTeam() {
            if (!deletingTeam) {
                return;
            }

            router.delete(
                route(
                    'admin.settings.teams.destroy',
                    deletingTeam.id,
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
                <Head title="Equipes" />

                <PageContainer>
                    <PageCard>
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Equipes</h3>
                            <p className="text-sm text-muted-foreground">Gerencie suas Equipes.</p>
                        </div>
                        <DataTable
                            data={teams}
                            columns={columns}
                            searchPlaceholder="Buscar equipe..."
                            exportFileName="equipes"
                            enableExport
                            headerActions={[
                                {
                                    permissions: [],
                                    type: 'button',
                                    label:
                                        'Nova Equipe',
                                    icon: (
                                        <Plus
                                            size={
                                                16
                                            }
                                        />
                                    ),
                                    onClick:
                                        createTeam,
                                },
                            ]}
                        />
                    </PageCard>
                </PageContainer>

                <TeamFormModal
                    open={openForm}
                    onClose={() =>
                        setOpenForm(false)
                    }
                    team={editingTeam}
                    parentTeams={
                        parentTeams
                    }
                />

                <ConfirmModal
                    open={!!deletingTeam}
                    title="Excluir equipe"
                    description="Deseja realmente excluir esta equipe?"
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