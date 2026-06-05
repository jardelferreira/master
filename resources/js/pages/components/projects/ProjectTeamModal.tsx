import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

import Modal from '@/pages/components/Modal';
import ConfirmModal from '@/pages/components/ConfirmModal';

import ProjectTeamFormModal from './ProjectTeamFormModal';

type Team = {
    id: number;
    name: string;
    leaders_count?: number;
    employees_count?: number;
};

type TeamOption = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;

    onClose: () => void;

    project: {
        id: number;
        name: string;
        teams?: Team[];
    };

    availableTeams: TeamOption[];
};

export default function ProjectTeamsModal({
    open,
    onClose,
    project,
    availableTeams,
}: Props) {
    const [
        openForm,
        setOpenForm,
    ] = useState(false);

    const [
        deletingTeam,
        setDeletingTeam,
    ] = useState<Team | null>(
        null,
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
        <>
            <Modal
                open={open && !openForm}
                onClose={onClose}
                title="Equipes do Projeto"
                size="lg"
            >
                <div className="space-y-4">

                    <div className="rounded-xl border bg-slate-50 p-3">
                        <p className="font-medium text-slate-800">
                            {project.name}
                        </p>

                        <p className="text-xs text-slate-500">
                            Equipes vinculadas ao projeto
                        </p>
                    </div>

                    <div className="space-y-2">
                        {(project.teams ?? [])
                            .length === 0 && (
                                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                                    Nenhuma equipe vinculada.
                                </div>
                            )}

                        {(project.teams ?? []).map(
                            (team) => (
                                <div
                                    key={
                                        team.id
                                    }
                                    className="flex items-center justify-between rounded-xl border p-3"
                                >
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {
                                                team.name
                                            }
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {
                                                team.leaders_count ??
                                                0
                                            }{' '}
                                            líderes •{' '}
                                            {
                                                team.employees_count ??
                                                0
                                            }{' '}
                                            membros
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeletingTeam(
                                                team,
                                            )
                                        }
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2
                                            size={
                                                16
                                            }
                                        />
                                    </button>
                                </div>
                            ),
                        )}
                    </div>

                    <div className="flex justify-end border-t pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                
                                setOpenForm(
                                    true,
                                )
                            }
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus
                                size={16}
                            />

                            Vincular Equipe
                        </button>
                    </div>
                </div>
            </Modal>

            <ProjectTeamFormModal
                open={openForm}
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
        </>
    );
}