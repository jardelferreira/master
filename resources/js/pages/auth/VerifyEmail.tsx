import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    LoaderCircle,
    LogOut,
    MailCheck,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react';
import type { FormEvent } from 'react';

import type { PageProps } from '@/types/inertia';

export default function VerifyEmail() {
    const { auth, flash } = usePage<PageProps>().props;
    const form = useForm({});

    const handleResend = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(route('verification.send'), {
            preserveScroll: true,
        });
    };

    const resendSucceeded =
        flash?.status === 'success' || form.recentlySuccessful;

    return (
        <>
            <Head title="Verifique seu e-mail" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-6 py-12">
                <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-100/80 to-transparent" />
                <div className="absolute -top-16 right-0 h-64 w-64 rounded-full bg-blue-200/50 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />

                <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                    <div className="border-b border-slate-100 bg-slate-50 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                                <MailCheck className="h-7 w-7" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
                                    Confirmacao de conta
                                </p>
                                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                                    Verifique seu e-mail
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 px-8 py-8">
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 h-5 w-5 text-blue-700" />

                                <div className="space-y-2">
                                    <p className="text-sm leading-6 text-slate-700">
                                        Enviamos um link de verificacao para:
                                    </p>

                                    <p className="rounded-xl bg-white px-4 py-3 font-semibold break-all text-slate-900 shadow-sm">
                                        {auth.user.email}
                                    </p>

                                    <p className="text-sm leading-6 text-slate-600">
                                        Abra sua caixa de entrada, clique no
                                        link recebido e volte para continuar
                                        acessando o sistema.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {resendSucceeded ? (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5" />
                                    <div>
                                        <p className="font-semibold">
                                            Novo link enviado
                                        </p>
                                        <p className="mt-1 text-sm">
                                            Verifique seu e-mail novamente. Se
                                            nao encontrar, confira tambem a
                                            caixa de spam.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                            <p className="font-semibold text-slate-800">
                                Se ainda nao recebeu:
                            </p>
                            <p>
                                1. Aguarde alguns instantes e atualize sua caixa
                                de entrada.
                            </p>
                            <p>
                                2. Confira as pastas de spam, lixo eletronico ou
                                promocoes.
                            </p>
                            <p>
                                3. Clique abaixo para reenviar o e-mail de
                                verificacao.
                            </p>
                        </div>

                        <form className="space-y-3" onSubmit={handleResend}>
                            <button
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={form.processing}
                                type="submit"
                            >
                                {form.processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                Reenviar e-mail de verificacao
                            </button>
                        </form>

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                            <Link
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                                href={route('dashboard')}
                            >
                                Tentar acessar o sistema
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                as="button"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-5 py-3 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                href={route('logout')}
                                method="post"
                            >
                                <LogOut className="h-4 w-4" />
                                Sair
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
