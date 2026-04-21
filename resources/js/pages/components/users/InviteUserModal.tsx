import { useForm } from '@inertiajs/react';
import Modal from '@/pages/components/Modal';

type Props = {
    open: boolean;
    onClose: () => void;
};

type InviteForm = {
    email: string;
};

export default function InviteUserModal({ open, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } =
        useForm<InviteForm>({
            email: '',
        });

    function submit(e: React.SubmitEvent) {
        e.preventDefault();

        post(route('admin.users.invite'), {
            onSuccess: (data) => {
                reset();
                onClose();
            },
        });
    }

    return (
        <Modal open={open} onClose={onClose} title="Convidar usuário">
            <form onSubmit={submit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-base-700">
                        E-mail do usuário
                    </label>

                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-core-500 focus:outline-none ${errors.email ? 'border-red-500' : 'border-base-300'} `}
                        placeholder="usuario@empresa.com"
                        required
                        disabled={processing}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-md bg-core-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                        {processing && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        Enviar convite
                    </button>
                </div>
            </form>
        </Modal>
    );
}
