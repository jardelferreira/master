import { useForm } from '@inertiajs/react';

type InviteForm = {
    email: string;
};

export default function InviteUserForm() {
    const { data, setData, post, processing, errors, reset } =
        useForm<InviteForm>({
            email: '',
        });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(route('admin.invitations.store'), {
            onSuccess: (data) => {
                reset();
            },
        });
    }

    return (
        <form
            onSubmit={submit}
            className="max-w-md space-y-4 rounded-xl border bg-white p-6"
        >
            <div>
                <label className="mb-1 block text-sm font-medium">
                    E-mail do usuário
                </label>

                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="usuario@empresa.com"
                    required
                />

                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center justify-center rounded-md bg-core-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
                {processing ? 'Enviando...' : 'Enviar convite'}
            </button>
        </form>
    );
}
