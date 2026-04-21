import Modal from "@/pages/components/Modal";
import { useState, useMemo, useEffect } from "react";
import { router } from "@inertiajs/react";

// ── Tipos ─────────────────────────────────────────

type User = {
    id: number;
    name: string;
    email: string;
};

type Project = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    project: Project;

    users: User[];
    assigned: number[];
};

// ── Componente ─────────────────────────────────────

export default function ProjectUsersModal({
    open,
    onClose,
    project,
    users,
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
    const filteredUsers = useMemo(() => {
        const query = search.toLowerCase();

        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
        );
    }, [users, search]);

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
        if (selected.length === users.length) {
            setSelected([]);
        } else {
            setSelected(users.map((u) => u.id));
        }
    }

    // 🚀 submit
    function submit() {
        setProcessing(true);

        router.post(
            route("admin.projects.sync.users", project.id),
            {
                users: selected,
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
            title={`Usuários do projeto "${project.name}"`}
            size="lg"
            footer={
                <div className="flex justify-between items-center">

                    {/* ações rápidas */}
                    <button
                        onClick={toggleAll}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        {selected.length === users.length
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
                    placeholder="Buscar usuários..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                {/* 📋 Lista */}
                <div className="max-h-[400px] overflow-y-auto border rounded-xl">

                    {filteredUsers.length === 0 && (
                        <div className="p-4 text-sm text-slate-400 text-center">
                            Nenhum usuário encontrado
                        </div>
                    )}

                    {filteredUsers.map((user) => {
                        const isChecked = selected.includes(user.id);

                        return (
                            <div
                                key={user.id}
                                onClick={() => toggle(user.id)}
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
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {user.email}
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
                    {selected.length} usuário(s) selecionado(s)
                </p>

            </div>
        </Modal>
    );
}