import { useForm, router } from '@inertiajs/react';
import Modal from '@/pages/components/Modal';
import { useEffect, useRef } from 'react';
import { User } from 'lucide-react';

// ── Tipos ─────────────────────────────────────────

type UserData = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    user: UserData;
};

type FormData = {
    name: string;
};

export default function UpdateUserProfileModal({ open, onClose, user }: Props) {

    const initialRef = useRef({
        name: user.name,
    });

    const { data, setData, reset, processing, errors } = useForm<FormData>({
        name: user.name,
    });

    const nameRef = useRef<HTMLInputElement>(null);

    // 🔄 sincroniza usuário
    useEffect(() => {
        initialRef.current = {
            name: user.name,
        };

        reset();
        setData({
            name: user.name,
        });
    }, [user.id]);

    // 🎯 foco
    useEffect(() => {
        if (open) setTimeout(() => nameRef.current?.focus(), 80);
    }, [open]);

    function handleClose() {
        reset();
        onClose();
    }

    // 🔥 submit inteligente
    function submit(e: React.SubmitEvent) {
        e.preventDefault();

        if (data.name === initialRef.current.name) {
            onClose();
            return;
        }

        router.put(route('admin.users.update.profile', user.id), {
            name: data.name,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    const hasChanges = data.name !== initialRef.current.name;
    const isValid = data.name.trim().length > 0;

    return (
        <Modal open={open} onClose={handleClose} title="Editar nome do usuário">
            <form onSubmit={submit} className="space-y-5">

                {/* Nome */}
                <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <User size={14} />
                        Nome
                    </label>

                    <input
                        ref={nameRef}
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-sm
                            focus:ring-2 focus:ring-blue-500/20
                            ${errors.name ? 'border-red-500' : 'border-slate-200'}
                        `}
                        placeholder="Nome do usuário"
                        disabled={processing}
                        maxLength={100}
                    />

                    {errors.name && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">

                    <span className={`text-xs ${hasChanges ? 'text-amber-500' : 'text-transparent'}`}>
                        Alterações não salvas
                    </span>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm border rounded-xl"
                            disabled={processing}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={!isValid || !hasChanges || processing}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl disabled:opacity-50"
                        >
                            Salvar
                        </button>
                    </div>
                </div>

            </form>
        </Modal>
    );
}