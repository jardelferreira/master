import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Lock, Mail } from 'lucide-react';
import type { FormEvent } from 'react';

type ResetPasswordProps = {
    email?: string;
    token: string;
};

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({
    email = '',
    token,
}: ResetPasswordProps) {
    const form = useForm<ResetPasswordForm>({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(route('password.update'), {
            preserveScroll: true,
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Redefinir senha" />

            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-6">
                <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-8 shadow-xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-blue-700">
                            Nova senha
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Defina sua nova senha para continuar.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label
                                className="mb-2 block text-xs font-bold text-gray-400 uppercase"
                                htmlFor="email"
                            >
                                E-mail
                            </label>

                            <div className="relative">
                                <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    autoComplete="email"
                                    className="w-full rounded-lg bg-gray-100 py-3 pr-4 pl-12 text-gray-700 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    id="email"
                                    name="email"
                                    onChange={(event) =>
                                        form.setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                    type="email"
                                    value={form.data.email}
                                />
                            </div>

                            {form.errors.email ? (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.errors.email}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-xs font-bold text-gray-400 uppercase"
                                htmlFor="password"
                            >
                                Nova senha
                            </label>

                            <div className="relative">
                                <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    autoComplete="new-password"
                                    className="w-full rounded-lg bg-gray-100 py-3 pr-4 pl-12 text-gray-700 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    id="password"
                                    name="password"
                                    onChange={(event) =>
                                        form.setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                    type="password"
                                    value={form.data.password}
                                />
                            </div>

                            {form.errors.password ? (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.errors.password}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-xs font-bold text-gray-400 uppercase"
                                htmlFor="password_confirmation"
                            >
                                Confirmar senha
                            </label>

                            <div className="relative">
                                <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    autoComplete="new-password"
                                    className="w-full rounded-lg bg-gray-100 py-3 pr-4 pl-12 text-gray-700 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    onChange={(event) =>
                                        form.setData(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                    type="password"
                                    value={form.data.password_confirmation}
                                />
                            </div>
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={form.processing}
                            type="submit"
                        >
                            {form.processing ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : null}
                            Redefinir senha
                        </button>
                    </form>

                    <div className="mt-6">
                        <Link
                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                            href={route('login')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
