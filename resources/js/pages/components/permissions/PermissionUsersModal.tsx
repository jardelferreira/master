import Modal from "@/pages/components/Modal";
import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import type { User } from "@/types";
import { SimpleUser } from "@/types/user";
type Permission = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    permission: Permission;

    // vindo do backend
    users: SimpleUser[];
    assigned: number[]; // ids vinculados
};

export default function PermissionUsersModal({
    open,
    onClose,
    permission,
    users,
    assigned,
}: Props) {
    const [selected, setSelected] = useState<number[]>(assigned);
    const [search, setSearch] = useState("");

    // 🔍 filtro
    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    function toggle(id: number) {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    }

    function submit() {
        router.post(
            route("admin.permissions.sync.users", permission.id),
            {
                users: selected,
            },
            {
                onSuccess: () => onClose(),
            }
        );
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`Usuários com "${permission.name}"`}
            size="lg"
            footer={
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-xl"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={submit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                    >
                        Salvar
                    </button>
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
                                    <p className="text-sm font-medium">
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

                {/* 📊 Contador */}
                <p className="text-xs text-slate-500">
                    {selected.length} usuário(s) selecionado(s)
                </p>

            </div>
        </Modal>
    );
}