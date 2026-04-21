import Modal from "@/pages/components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";

// ── Tipos ─────────────────────────────────────────

type Permission = {
    id: number;
    name: string;
    description?: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    permission: Permission;
};

// ── Componente ─────────────────────────────────────

export default function PermissionEditModal({
    open,
    onClose,
    permission,
}: Props) {

    const nameRef = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        isDirty,
    } = useForm({
        name: permission.name,
        description: permission.description || "",
    });

    // 🔥 sincroniza ao abrir / trocar permissão
    useEffect(() => {
        if (open) {
            reset();
            setData({
                name: permission.name,
                description: permission.description || "",
            });

            setTimeout(() => nameRef.current?.focus(), 80);
        }
    }, [permission.id, open]);

    function handleClose() {
        reset();
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!isDirty) {
            onClose();
            return;
        }

        put(route("admin.permissions.update", permission.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Editar permissão"
            size="md"
            footer={
                <div className="flex justify-between items-center">

                    <span className={`text-xs ${isDirty ? 'text-amber-500' : 'text-transparent'}`}>
                        Alterações não salvas
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={handleClose}
                            disabled={processing}
                            className="px-4 py-2 border rounded-xl"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={submit}
                            disabled={processing || !data.name.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
                        >
                            {processing ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </div>
            }
        >
            <form onSubmit={submit} className="space-y-4">

                {/* Nome */}
                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Nome da permissão
                    </label>

                    <input
                        ref={nameRef}
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={`w-full mt-1 border rounded-xl px-3 py-2 text-sm
                            ${errors.name ? "border-red-500" : "border-slate-200"}
                        `}
                        placeholder="Ex: users.create"
                        disabled={processing}
                    />

                    {errors.name && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Descrição */}
                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Descrição
                    </label>

                    <textarea
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className={`w-full mt-1 border rounded-xl px-3 py-2 text-sm
                            ${errors.description ? "border-red-500" : "border-slate-200"}
                        `}
                        placeholder="Descreva o que essa permissão permite"
                        rows={3}
                        disabled={processing}
                    />

                    {errors.description && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

            </form>
        </Modal>
    );
}