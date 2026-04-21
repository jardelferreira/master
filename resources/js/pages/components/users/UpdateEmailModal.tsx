import { useForm, router } from '@inertiajs/react';
import Modal from '@/pages/components/Modal';
import { useEffect, useRef } from 'react';
import { Mail, ShieldCheck, ShieldOff } from 'lucide-react';

// ── Tipos ─────────────────────────────────────────

type UserData = {
    id: number;
    email: string;
    email_verified_at: string | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    user: UserData;
};

type FormData = {
    email: string;
};

export default function UpdateUserEmailModal({ open, onClose, user }: Props) {

    const initialRef = useRef({
        email: user.email,
    });

    const { data, setData, reset, processing, errors } = useForm<FormData>({
        email: user.email,
    });

    const emailRef = useRef<HTMLInputElement>(null);

    // 🔄 sincroniza user
    useEffect(() => {
        initialRef.current = { email: user.email };

        reset();
        setData({ email: user.email });

    }, [user.id]);

    // 🎯 foco
    useEffect(() => {
        if (open) setTimeout(() => emailRef.current?.focus(), 80);
    }, [open]);

    function handleClose() {
        reset();
        onClose();
    }

    const hasChanges = data.email !== initialRef.current.email;
    const isValid = data.email.trim().length > 0;

    const isVerified = !!user.email_verified_at;

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!hasChanges) {
            onClose();
            return;
        }

        router.put(route('admin.users.update.email', user.id), {
            email: data.email,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    return (
        <Modal open={open} onClose={handleClose} title="Alterar e-mail">
            <form onSubmit={submit} className="space-y-5">

                {/* STATUS */}
                <div className="flex items-center gap-3 p-3 rounded-xl border bg-slate-50">
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                        isVerified
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                    }`}>
                        {isVerified
                            ? <><ShieldCheck size={12}/> Verificado</>
                            : <><ShieldOff size={12}/> Não verificado</>}
                    </span>

                    <span className="text-xs text-slate-500">
                        {user.email}
                    </span>
                </div>

                {/* INPUT */}
                <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Mail size={14} />
                        Novo e-mail
                    </label>

                    <input
                        ref={emailRef}
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-sm
                            focus:ring-2 focus:ring-blue-500/20
                            ${errors.email ? 'border-red-500' : 'border-slate-200'}
                        `}
                        placeholder="usuario@empresa.com"
                        disabled={processing}
                    />

                    {errors.email && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* AVISO */}
                {hasChanges && (
                    <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                        Ao alterar o e-mail, ele será marcado como não verificado e um novo e-mail de confirmação será enviado.
                    </div>
                )}

                {/* ACTIONS */}
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
                            Atualizar e-mail
                        </button>
                    </div>
                </div>

            </form>
        </Modal>
    );
}