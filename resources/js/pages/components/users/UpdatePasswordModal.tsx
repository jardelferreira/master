import { useForm, router } from '@inertiajs/react';
import Modal from '@/pages/components/Modal';
import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

// ── Tipos ─────────────────────────────────────────

type Props = {
    open: boolean;
    onClose: () => void;
    userId: number;
};

type FormData = {
    password: string;
    password_confirmation: string;
};

export default function UpdateUserPasswordModal({ open, onClose, userId }: Props) {

    const { data, setData, reset, processing, errors } = useForm<FormData>({
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const passwordRef = useRef<HTMLInputElement>(null);

    // 🎯 foco automático
    useEffect(() => {
        if (open) {
            setTimeout(() => passwordRef.current?.focus(), 80);
        }
    }, [open]);

    function handleClose() {
        reset();
        onClose();
    }

    // 🔥 validação local
    const isValid =
        data.password.length >= 8 &&
        data.password === data.password_confirmation;

    const hasInput = data.password.length > 0 || data.password_confirmation.length > 0;

    // 🚀 submit
    function submit(e: React.SubmitEvent) {
        e.preventDefault();

        if (!isValid) return;

        router.put(route('admin.users.update.password', userId), {
            password: data.password,
            password_confirmation: data.password_confirmation,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    return (
        <Modal open={open} onClose={handleClose} title="Alterar senha">
            <form onSubmit={submit} className="space-y-5">

                {/* Nova senha */}
                <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Lock size={14} />
                        Nova senha
                    </label>

                    <div className="relative">
                        <input
                            ref={passwordRef}
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 pr-10 text-sm
                                focus:ring-2 focus:ring-blue-500/20
                                ${errors.password ? 'border-red-500' : 'border-slate-200'}
                            `}
                            placeholder="Mínimo 8 caracteres"
                            disabled={processing}
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Confirmar senha */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Confirmar senha
                    </label>

                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-2 pr-10 text-sm
                                focus:ring-2 focus:ring-blue-500/20
                                ${
                                    data.password_confirmation &&
                                    data.password !== data.password_confirmation
                                        ? 'border-red-500'
                                        : data.password_confirmation &&
                                          data.password === data.password_confirmation
                                        ? 'border-emerald-400'
                                        : 'border-slate-200'
                                }
                            `}
                            placeholder="Repita a senha"
                            disabled={processing}
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirm(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {data.password_confirmation && data.password !== data.password_confirmation && (
                        <p className="text-xs text-red-600 mt-1">As senhas não coincidem</p>
                    )}

                    {data.password_confirmation && data.password === data.password_confirmation && (
                        <p className="text-xs text-emerald-600 mt-1">Senhas coincidem ✓</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">

                    <span className={`text-xs ${hasInput ? 'text-amber-500' : 'text-transparent'}`}>
                        {hasInput && 'Preencha corretamente para salvar'}
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
                            disabled={!isValid || processing}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl disabled:opacity-50"
                        >
                            Salvar senha
                        </button>
                    </div>
                </div>

            </form>
        </Modal>
    );
}