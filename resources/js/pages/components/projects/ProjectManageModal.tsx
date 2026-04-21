import Modal from "@/pages/components/Modal";
import { useState } from "react";
import {
    Users,
    Layers,
    Pencil,
    Trash2,
    ChevronRight,
} from "lucide-react";
import ProjectUsersModal from "./ProjectUsersModal";
import { SimpleUser } from "@/types/user";
import ProjectSectorsModal, { Sector } from "./ProjectSectorsModal";
import ProjectEditModal from "./ProjectEditModal";
import ProjectDeleteModal from "./ProjectDeleteModal";
import { usePage } from "@inertiajs/react";

// ── Tipos ─────────────────────────────────────────

type Project = {
    id: number, 
    name: string,
    description: string,
    initials: string,
    sectors: any[],
    users: SimpleUser[] 
};

type Props = {
    open: boolean;
    onClose: () => void;
    project: Project;
    users: SimpleUser[];
};

type ProjectModal =
    | null
    | 'users'
    | 'sectors'
    | 'edit'
    | 'delete';

// ── Componente ─────────────────────────────────────

export default function ProjectManageModal({
    open,
    onClose,
    project,
    users,
}: Props) {

    const [modal, setModal] = useState<ProjectModal>(null);


    function closeAll() {
        setModal(null);
        onClose();
    }

    function closeChild() {
        setModal(null);
    }

    return (
        <>
            {/* MENU PRINCIPAL */}
            <Modal
                open={open && modal === null}
                onClose={closeAll}
                title="Gerenciar projeto"
                size="md"
            >
                <div className="space-y-4">

                    {/* INFO */}
                    <div className="p-3 rounded-xl bg-slate-50 border">
                        <p className="text-sm font-semibold text-slate-800">
                            {project.name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {project.description || "Sem descrição"}
                        </p>
                    </div>

                    {/* AÇÕES */}
                    <div className="space-y-2">

                        <ActionItem
                            icon={Users}
                            label="Usuários do projeto"
                            description="Gerenciar acessos"
                            onClick={() => setModal('users')}
                        />

                        <ActionItem
                            icon={Layers}
                            label="Setores"
                            description="Gerenciar setores"
                            onClick={() => setModal('sectors')}
                        />

                        <ActionItem
                            icon={Pencil}
                            label="Editar projeto"
                            description="Alterar informações"
                            onClick={() => setModal('edit')}
                        />

                        <ActionItem
                            icon={Trash2}
                            label="Excluir projeto"
                            description="Remover permanentemente"
                            danger
                            onClick={() => setModal('delete')}
                        />

                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={closeAll}
                            className="px-4 py-2 text-sm border rounded-xl"
                        >
                            Fechar
                        </button>
                    </div>

                </div>
            </Modal>

            {/* ── MODAIS FILHOS ───────────────────── */}

            {modal === 'users' && (
                <ProjectUsersModal
                    open
                    onClose={closeChild}
                    project={project}
                    users={users}
                    assigned={project.users?.map(u => u.id) || []}
                />
            )}

            {modal === 'sectors' && (
                <ProjectSectorsModal
                    open
                    onClose={closeChild}
                    project={project}
                    sectors={project.sectors || []}
                />
            )}

            {modal === 'edit' && (
                <ProjectEditModal
                    open
                    onClose={closeChild}
                    project={project}
                />
            )}

            {modal === 'delete' && (
                <ProjectDeleteModal
                    open
                    onClose={closeChild}
                    project={project}
                />
            )}
        </>
    );
}

// ── ITEM ───────────────────────────────────────────

function ActionItem({
    icon: Icon,
    label,
    description,
    onClick,
    danger = false,
}: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-left
                ${danger
                    ? "border-red-200 hover:bg-red-50"
                    : "border-slate-200 hover:bg-slate-50"
                }
            `}
        >
            <div
                className={`w-9 h-9 flex items-center justify-center rounded-lg
                    ${danger ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"}
                `}
            >
                <Icon size={16} />
            </div>

            <div className="flex-1">
                <p className={`text-sm font-medium ${danger ? "text-red-700" : "text-slate-800"}`}>
                    {label}
                </p>
                <p className="text-xs text-slate-400">
                    {description}
                </p>
            </div>

            <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
    );
}