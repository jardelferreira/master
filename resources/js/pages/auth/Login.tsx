import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useCountdown } from '@/hooks/useContdown';
import {
    Archive,
    LoaderCircle,
    Lock,
    LogIn,
    Mail,
    ShieldCheck,
} from 'lucide-react';
import type { SubmitEvent } from 'react';

import type { PageProps } from '@/types/inertia';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const { auth, emailVerificationEnabled, errors } = usePage<PageProps>().props;
    const form = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(route('login'), {
            preserveScroll: true,
            onFinish: () => form.reset('password'),
        });
    };

    const throttleTime = errors?.throttle
        ? Number(errors.throttle)
        : null;

    const countdown = useCountdown(throttleTime);

    return (
        <>
            <Head title="Entrar" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f9fa]">
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-100 opacity-40 blur-3xl" />

                <div className="w-full max-w-md px-6">
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
                            <Archive className="h-8 w-8 text-blue-700" />
                        </div>
                        <Link href={route('home')}>
                            <h1 className="text-3xl font-extrabold text-blue-600">
                                Estoque Master
                            </h1>
                        </Link>

                        <p className="mt-2 text-xs tracking-widest text-gray-400 uppercase">
                            O controle em suas maos
                        </p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-white p-8 shadow-xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    className="ml-1 text-xs font-bold text-gray-400 uppercase"
                                    htmlFor="email"
                                >
                                    E-mail
                                </label>

                                <div className="relative mt-2">
                                    <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                    <input
                                        autoComplete="email"
                                        className="w-full rounded-lg bg-gray-100 py-3 pr-4 pl-12 text-gray-700 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        id="email"
                                        disabled={!!(countdown && countdown > 0)}
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
                                {countdown && countdown > 0 && (
                                    <div className="text-sm text-red-500 font-medium">
                                        Muitas tentativas. Tente novamente em {countdown}s
                                    </div>
                                )}
                            </div>

                            <div>
                                <label
                                    className="text-xs font-bold text-gray-400 uppercase"
                                    htmlFor="password"
                                >
                                    Senha
                                </label>

                                <div className="relative mt-2">
                                    <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                    <input
                                        autoComplete="current-password"
                                        className="w-full rounded-lg bg-gray-100 py-3 pr-4 pl-12 text-gray-700 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        id="password"
                                        name="password"
                                        disabled={!!(countdown && countdown > 0)}
                                        onChange={(event) =>
                                            form.setData(
                                                'password',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="••••••••"
                                        type="password"
                                        value={form.data.password}
                                    />
                                </div>

                                {form.errors.password ? (
                                    <p className="mt-2 text-sm text-red-600">
                                        {form.errors.password}
                                    </p>
                                ) : null}

                                <div className="mt-3 flex justify-end">
                                    <Link
                                        className="text-sm font-semibold text-blue-600 hover:underline"
                                        href={route('password.request')}
                                    >
                                        Esqueceu sua senha?
                                    </Link>
                                </div>
                            </div>

                            <label
                                className="flex items-center gap-2 text-sm text-gray-600"
                                htmlFor="remember"
                            >
                                <input
                                    checked={form.data.remember}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    id="remember"
                                    name="remember"
                                    onChange={(event) =>
                                        form.setData(
                                            'remember',
                                            event.target.checked,
                                        )
                                    }
                                    type="checkbox"
                                />
                                Manter conectado
                            </label>

                            <button
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 py-3 font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={!!form.processing || !!(countdown && countdown > 0)}
                                type="submit"
                            >
                                {form.processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <LogIn className="h-4 w-4" />
                                )}
                                Entrar
                            </button>

                            {emailVerificationEnabled ? (
                                <p className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    Novos cadastros precisam confirmar o e-mail
                                    antes de acessar o sistema.
                                </p>
                            ) : null}
                        </form>

                        <div className="mt-8 border-t pt-6 text-center">
                            <p className="text-sm text-gray-400">
                                Nao tem uma conta?
                            </p>

                            <span className="mt-2 inline-block font-semibold text-blue-600">
                                Solicite acesso com o administrador do sistema
                            </span>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2 text-[10px] tracking-widest text-gray-400 uppercase">
                        <ShieldCheck className="h-3 w-3" />
                        Secure Enterprise Portal
                    </div>
                </div>
            </div>
        </>
    );
}
