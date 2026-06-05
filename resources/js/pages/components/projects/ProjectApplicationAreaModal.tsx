import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';

import Modal from '@/pages/components/Modal';
import ConfirmModal from '@/pages/components/ConfirmModal';

import ProjectApplicationAreaFormModal from './ProjectApplicationAreaFormModal';

type ApplicationArea = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;

    project: {
        id: number;
        name: string;

        application_areas?: ApplicationArea[];
    };

    availableAreas: ApplicationArea[];
};

export default function ProjectApplicationAreasModal({
    open,
    onClose,
    project,
    availableAreas,
}: Props) {
    const [
        openForm,
        setOpenForm,
    ] = useState(false);

    const [
        deletingArea,
        setDeletingArea,
    ] =
        useState<ApplicationArea | null>(
            null,
        );

    function destroyArea() {
        if (!deletingArea) {
            return;
        }

        router.delete(
            route(
                'admin.projects.application-areas.destroy',
                [
                    project.id,
                    deletingArea.id,
                ],
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

    console.log(project )
    return (
        <>
            <Modal
                open={open && !openForm}
                onClose={onClose}
                title="Áreas de Aplicação"
                size="lg"
            >
                <div className="space-y-4">

                    <div className="rounded-xl border bg-slate-50 p-3">
                        <p className="font-medium text-slate-800">
                            {project.name}
                        </p>

                        <p className="text-xs text-slate-500">
                            Áreas vinculadas ao projeto
                        </p>
                    </div>

                    {(project.application_areas ??
                        []).length ===
                        0 && (
                        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                            Nenhuma área vinculada.
                        </div>
                    )}

                    <div className="space-y-2">
                        {(project.application_areas ??
                            []).map(
                            (
                                area,
                            ) => (
                                <div
                                    key={
                                        area.id
                                    }
                                    className="flex items-center justify-between rounded-xl border p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                            <Layers
                                                size={
                                                    16
                                                }
                                            />
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-800">
                                                {
                                                    area.name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeletingArea(
                                                area,
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
                            onClick={() =>
                                setOpenForm(
                                    true,
                                )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus
                                size={16}
                            />

                            Vincular Área
                        </button>
                    </div>
                </div>
            </Modal>

            <ProjectApplicationAreaFormModal
                open={openForm}
                onClose={() =>
                    setOpenForm(
                        false,
                    )
                }
                projectId={
                    project.id
                }
                availableAreas={
                    availableAreas
                }
            />

            <ConfirmModal
                open={
                    !!deletingArea
                }
                title="Remover área"
                description={`Deseja remover a área "${deletingArea?.name}" deste projeto?`}
                onClose={() =>
                    setDeletingArea(
                        null,
                    )
                }
                onConfirm={
                    destroyArea
                }
            />
        </>
    );
}