import Modal from "@/pages/components/Modal";
import { useState, useMemo, useEffect } from "react";
import { router } from "@inertiajs/react";

// ── Tipos ─────────────────────────────────────────

export type Role = {
    id: number;
    name: string;
};

type Permission = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    permission: Permission;

    roles: Role[];
    assigned: number[];
};

// ── Componente ─────────────────────────────────────

export default function PermissionRolesModal({
    open,
    onClose,
    permission,
    roles,
    assigned,
}: Props) {

    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState("");
    const [processing, setProcessing] = useState(false);

    // 🔥 sincroniza estado ao abrir
    useEffect(() => {
        if (open) {
            setSelected(assigned);
            setSearch("");
        }
    }, [assigned, open]);

    // 🔍 filtro
    const filteredRoles = useMemo(() => {
        const query = search.toLowerCase();

        return roles.filter((r) =>
            r.name.toLowerCase().includes(query)
        );
    }, [roles, search]);

    // 🔁 toggle individual
    function toggle(id: number) {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    }

    // 🔁 selecionar todos
    function toggleAll() {
        if (selected.length === roles.length) {
            setSelected([]);
        } else {
            setSelected(roles.map((r) => r.id));
        }
    }

    // 🚀 submit
    function submit() {
        setProcessing(true);

        router.post(
            route("admin.permissions.sync.roles", permission.id),
            {
                roles: selected,
            },
            {
                onFinish: () => setProcessing(false),
                onSuccess: () => onClose(),
            }
        );
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`Funções com "${permission.name}"`}
            size="lg"
            footer={
                <div className="flex justify-between items-center">

                    {/* ações rápidas */}
                    <button
                        onClick={toggleAll}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        {selected.length === roles.length
                            ? "Limpar seleção"
                            : "Selecionar todos"}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            disabled={processing}
                            className="px-4 py-2 border rounded-xl"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={submit}
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
                        >
                            {processing ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </div>
            }
        >
            <div className="space-y-4">

                {/* 🔍 Busca */}
                <input
                    type="text"
                    placeholder="Buscar funções..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                {/* 📋 Lista */}
                <div className="max-h-[400px] overflow-y-auto border rounded-xl">

                    {filteredRoles.length === 0 && (
                        <div className="p-4 text-sm text-slate-400 text-center">
                            Nenhuma função encontrada
                        </div>
                    )}

                    {filteredRoles.map((role) => {
                        const isChecked = selected.includes(role.id);

                        return (
                            <div
                                key={role.id}
                                onClick={() => toggle(role.id)}
                                className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b last:border-0 transition
                                    ${
                                        isChecked
                                            ? "bg-blue-50"
                                            : "hover:bg-slate-50"
                                    }
                                `}
                            >
                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        {role.name}
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                />
                            </div>
                        );
                    })}
                </div>

                {/* 📊 contador */}
                <p className="text-xs text-slate-500">
                    {selected.length} função(ões) selecionada(s)
                </p>

            </div>
        </Modal>
    );
}