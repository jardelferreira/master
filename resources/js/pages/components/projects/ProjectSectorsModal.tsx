import Modal from "@/pages/components/Modal";
import { useState } from "react";
import { Layers, Plus } from "lucide-react";
import CreateSectorModal from "../sectors/CreateSectorModal";

// ── Tipos ─────────────────────────────────────────

export type Sector = {
    id: number;
    name: string;
    description?: string;
};

type Project = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    project: Project;
    sectors: Sector[];
};

// ── Componente ─────────────────────────────────────

export default function ProjectSectorsModal({
    open,
    onClose,
    project,
    sectors,
}: Props) {

    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
            {/* MODAL PRINCIPAL */}
            <Modal
                open={open && !createOpen}
                onClose={onClose}
                title={`Setores do projeto "${project.name}"`}
                size="lg"
                footer={
                    <div className="flex justify-between items-center">

                        <button
                            onClick={() => setCreateOpen(true)}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                            <Plus size={14} />
                            Novo setor
                        </button>

                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-xl"
                        >
                            Fechar
                        </button>
                    </div>
                }
            >
                <div className="space-y-4">

                    {/* EMPTY */}
                    {sectors.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            Nenhum setor cadastrado
                        </div>
                    )}

                    {/* LISTA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        {sectors.map((sector) => (
                            <div
                                key={sector.id}
                                className="p-4 rounded-xl border hover:shadow-sm transition bg-white"
                            >
                                <div className="flex items-start gap-3">

                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Layers size={16} />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {sector.name}
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">
                                            {sector.description || "Sem descrição"}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </Modal>

            {/* MODAL DE CRIAÇÃO (REUTILIZADO) */}
            {createOpen && (
                <CreateSectorModal
                    open
                    onClose={() => setCreateOpen(false)}
                    projectId={project.id}
                />
            )}
        </>
    );
}