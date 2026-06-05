import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';

import {PageContainer} from '@/pages/components/PageContainer';
import {PageCard} from '@/pages/components/PageCard';
import ConfirmModal from '@/pages/components/ConfirmModal';
import { DataTable } from '@/pages/components/DataTable';

import TeamMemberFormModal from '@/pages/components/teams/members/TeamMemberFormModal';
import { buildColumns } from '@/pages/components/teams/members/Columns';
import type { Team } from '@/types/team';
import type {
    TeamMember,
    TeamMemberEmployeeOption,
} from '@/types/team-member';

type RoleOption = {
    value: string;
    label: string;
};

type Props = {
    team: Pick<
        Team,
        'id' | 'name'
    > & {
        parent_name?: string | null;
    };

    members: TeamMember[];

    employees: TeamMemberEmployeeOption[];

    roles: RoleOption[];
};

export default function Index({
    team,
    members,
    employees,
    roles,
}: Props) {
    const [openForm, setOpenForm] =
        useState(false);

    const [editingMember, setEditingMember] =
        useState<TeamMember | null>(
            null,
        );

    const [deletingMember, setDeletingMember] =
        useState<TeamMember | null>(
            null,
        );

    const columns = useMemo(
        () =>
            buildColumns({
                onEdit: (
                    member,
                ) => {
                    setEditingMember(
                        member,
                    );

                    setOpenForm(
                        true,
                    );
                },

                onDelete: (
                    member,
                ) => {
                    setDeletingMember(
                        member,
                    );
                },
            }),
        [],
    );

    function createMember() {
        setEditingMember(null);
        setOpenForm(true);
    }

    function destroyMember() {
        if (!deletingMember) {
            return;
        }

        router.delete(
            route(
                'admin.settings.teams.members.destroy',
                [
                    team.id,
                    deletingMember.id,
                ],
            ),
            {
                preserveScroll: true,

                onSuccess: () =>
                    setDeletingMember(
                        null,
                    ),
            },
        );
    }

    return (
        <DashboardLayout>
            <Head
                title={`Equipe - ${team.name}`}
            />

            <PageContainer>
                <PageCard>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <button
                                type="button"
                                onClick={() =>
                                    router.visit(
                                        route(
                                            'admin.settings.teams.index',
                                        ),
                                    )
                                }
                                className="mb-2 inline-flex items-center gap-2 text-sm text-base-500 hover:text-base-700"
                            >
                                <ArrowLeft
                                    size={16}
                                />

                                Voltar para
                                equipes
                            </button>

                            <h1 className="text-2xl font-semibold">
                                {
                                    team.name
                                }
                            </h1>

                            {team.parent_name && (
                                <p className="text-sm text-base-500">
                                    Equipe
                                    pai:{' '}
                                    {
                                        team.parent_name
                                    }
                                </p>
                            )}
                        </div>
                    </div>

                    <DataTable
                        data={members}
                        columns={columns}
                        searchPlaceholder="Buscar membro..."
                        exportFileName={`team-${team.id}-members`}
                        enableExport
                        headerActions={[
                            {
                                permissions:[],
                                type: 'button',
                                label:
                                    'Adicionar Membro',
                                icon: (
                                    <Plus
                                        size={
                                            16
                                        }
                                    />
                                ),
                                onClick:
                                    createMember,
                            },
                        ]}
                    />
                </PageCard>
            </PageContainer>

            <TeamMemberFormModal
                open={openForm}
                onClose={() =>
                    setOpenForm(false)
                }
                teamId={team.id}
                member={
                    editingMember
                }
                employees={
                    employees
                }
                roles={roles}
            />

            <ConfirmModal
                open={
                    !!deletingMember
                }
                title="Remover membro"
                description={`Deseja remover ${
                    deletingMember?.name ??
                    ''
                } da equipe?`}
                onClose={() =>
                    setDeletingMember(
                        null,
                    )
                }
                onConfirm={
                    destroyMember
                }
            />
        </DashboardLayout>
    );
}