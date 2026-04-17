import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Mail } from 'lucide-react';
import type { FormEvent } from 'react';

type ForgotPasswordForm = {
    email: string;
};

export default function ForgotPassword() {
    const form = useForm<ForgotPasswordForm>({
        email: '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(route('password.email'), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Recuperar senha" />

            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-6">
                <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-8 shadow-xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-blue-700">
                            Recuperar senha
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Informe seu e-mail para receber o link de
                            redefinicao.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                                    placeholder="nome@empresa.com"
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

                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={form.processing}
                            type="submit"
                        >
                            {form.processing ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : null}
                            Enviar link
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
