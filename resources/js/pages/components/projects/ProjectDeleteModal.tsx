import Modal from "@/pages/components/Modal";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { AlertTriangle } from "lucide-react";

type Project = {
    id: number;
    name: string;
    sectors: any[];
    users: any[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    project: Project;
};

export default function ProjectDeleteModal({
    open,
    onClose,
    project,
}: Props) {

    const [confirmName, setConfirmName] = useState("");
    const [processing, setProcessing] = useState(false);
    const [ready, setReady] = useState(false);

    const isMatch = confirmName.trim() === project.name;

    // 🔥 delay de segurança
    useEffect(() => {
        if (!open) return;

        setReady(false);
        setConfirmName("");

        const timer = setTimeout(() => {
            setReady(true);
        }, 1500); // 1.5s

        return () => clearTimeout(timer);
    }, [open]);

    function handleClose() {
        setConfirmName("");
        onClose();
    }

    function submit() {
        if (!isMatch || !ready) return;

        setProcessing(true);

        router.delete(route("admin.projects.destroy", project.id), {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                setConfirmName("");
                onClose();
            },
        });
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Excluir projeto"
            size="md"
        >
            <div className="space-y-5">

                {/* ⚠️ ALERTA */}
                <div className="flex gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
                    <div className="text-red-600 mt-0.5">
                        <AlertTriangle size={18} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-red-700">
                            Ação irreversível
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                            Este projeto será permanentemente removido.
                        </p>
                    </div>
                </div>

                {/* 📊 IMPACTO */}
                <div className="p-4 rounded-xl border bg-slate-50 space-y-2">

                    <p className="text-xs text-slate-500 font-medium">
                        Impacto da exclusão
                    </p>

                    <ul className="text-sm text-slate-700 space-y-1">
                        <li>
                            • <strong>{project.sectors.length}</strong> setor(es) serão removidos
                        </li>
                        <li>
                            • <strong>{project.users.length}</strong> usuário(s) perderão acesso
                        </li>
                    </ul>

                </div>

                {/* INFO */}
                <div className="p-3 rounded-xl border bg-white">
                    <p className="text-xs text-slate-500">Projeto</p>
                    <p className="text-sm font-semibold text-slate-800">
                        {project.name}
                    </p>
                </div>

                {/* CONFIRMAÇÃO */}
                <div className="space-y-2">
                    <label className="text-sm text-slate-700">
                        Digite o nome do projeto para confirmar:
                    </label>

                    <input
                        type="text"
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        disabled={processing || !ready}
                        className={`w-full rounded-xl border px-3 py-2 text-sm transition
                            ${confirmName && !isMatch
                                ? "border-red-400 bg-red-50"
                                : "border-slate-200"}
                            ${!ready ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                        placeholder={!ready ? "Aguarde..." : project.name}
                    />

                    {!isMatch && confirmName.length > 0 && (
                        <p className="text-xs text-red-600">
                            O nome não corresponde
                        </p>
                    )}

                    {!ready && (
                        <p className="text-xs text-amber-500">
                            Aguarde um momento antes de confirmar…
                        </p>
                    )}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 pt-2">

                    <button
                        onClick={handleClose}
                        disabled={processing}
                        className="px-4 py-2 border rounded-xl text-sm"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={submit}
                        disabled={!isMatch || !ready || processing}
                        className="
                            px-4 py-2 text-sm rounded-xl
                            bg-red-600 hover:bg-red-700 text-white
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {processing
                            ? "Excluindo..."
                            : !ready
                                ? "Aguarde..."
                                : "Excluir projeto"}
                    </button>

                </div>

            </div>
        </Modal>
    );
}