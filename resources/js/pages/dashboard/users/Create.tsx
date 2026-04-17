import { Head, useForm, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import type { PageProps } from '@/types/inertia';

type FormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function CreateUser() {
    const { auth, emailVerificationEnabled } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('admin.users.store'),{
            onSuccess: () => {
                reset();
            }
        });
    }

    return (
        <>
            <Head title="Criar usuário" />

            <div className="mx-auto w-full max-w-3xl">
                {/* Header */}
                <div className="mb-6">
                    {/* <h1 className="text-2xl font-semibold text-base-900">
                    Novo usuário
                    </h1> */}
                    <p className="mt-1 text-blue-600 text-xl font-bold bg-blue-100 inline-block px-3 py-1 rounded">
                        Cadastre um novo usuário para acessar a plataforma
                    </p>
                </div>

                {/* Card */}
                <form
                    onSubmit={submit}
                    className="rounded-xl border border-base-200 bg-white shadow-sm"
                >
                    {/* Conteúdo */}
                    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">
                        {/* Nome */}
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-base-700">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-core-500 focus:outline-none ${errors.name
                                        ? 'border-red-500'
                                        : 'border-base-300'
                                    } `}
                                placeholder="Ex: João da Silva"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-base-700">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-core-500 focus:outline-none ${errors.email
                                        ? 'border-red-500'
                                        : 'border-base-300'
                                    } `}
                                placeholder="email@empresa.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}

                        </div>

                        {/* Senha */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-base-700">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-core-500 focus:outline-none ${errors.password
                                        ? 'border-red-500'
                                        : 'border-base-300'
                                    } `}
                                placeholder="••••••••"
                            />

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirmação */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-base-700">
                                Confirmar senha
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-md border border-base-300 px-3 py-2 text-sm focus:ring-2 focus:ring-core-500 focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                    </div>
                    <p className="m-2 text-sm text-red-600">
                        *Lembre-se de guardar os dados de acesso para compartilhar com o usuário, ou ele poderá solicitar uma redefinição de senha posteriormente.
                    </p>
                    {/* Footer / Actions */}
                    <div className="flex flex-col items-center justify-between gap-3 rounded-b-xl border-t border-base-200 bg-base-50 px-6 py-4 sm:flex-row sm:px-8">
                        <p className="font-bold text-blue-500">
                            {emailVerificationEnabled
                                ? 'O usuário receberá um e-mail de confirmação.'
                                : 'O usuário poderá acessar o sistema sem confirmação por e-mail.'}
                        </p>

                        <div className="flex gap-3">
                            <Link
                                href={route('admin.users')}
                                className="inline-flex items-center justify-center rounded-md border border-base-300 px-4 py-2 text-sm font-medium text-base-700 hover:bg-base-100"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-md bg-core-600 px-5 py-2 text-sm font-medium text-white hover:bg-core-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Criar usuário
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateUser.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
