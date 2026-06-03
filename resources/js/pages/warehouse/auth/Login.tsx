import { Head, useForm } from '@inertiajs/react';
import {
    Warehouse,
    Mail,
    Lock,
    Loader2,
} from 'lucide-react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function WarehouseLogin() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(route('warehouse.login.store'));
    }

    return (
        <>
            <Head title="Warehouse Login" />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
                <div className="grid min-h-screen lg:grid-cols-2">
                    {/* left branding */}
                    <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white">
                        <div className="flex items-center gap-4">
                            <div className="rounded-3xl bg-blue-600 p-4 shadow-xl">
                                <Warehouse size={32} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">
                                    Warehouse
                                </p>

                                <h1 className="text-2xl font-bold">
                                    Controle Operacional
                                </h1>
                            </div>
                        </div>

                        <div className="max-w-lg">
                            <h2 className="text-5xl font-bold leading-tight">
                                Gestão operacional de estoque para almoxarifado
                            </h2>

                            <p className="mt-6 text-lg leading-relaxed text-slate-300">
                                Controle movimentações, acompanhe níveis críticos,
                                gerencie materiais e opere estoques de forma
                                rápida e segura.
                            </p>
                        </div>

                        <div className="text-sm text-slate-400">
                            Warehouse Portal
                        </div>
                    </div>

                    {/* form */}
                    <div className="flex items-center justify-center px-6 py-10">
                        <div className="w-full max-w-md">
                            {/* mobile logo */}
                            <div className="mb-8 flex justify-center lg:hidden">
                                <div className="rounded-3xl bg-blue-600 p-5 text-white shadow-xl">
                                    <Warehouse size={30} />
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900">
                                        Acessar Warehouse
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Entre com suas credenciais para acessar
                                        o ambiente operacional.
                                    </p>
                                </div>

                                <form
                                    onSubmit={submit}
                                    className="space-y-5"
                                >
                                    {/* email */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            E-mail
                                        </label>

                                        <div className="relative">
                                            <Mail
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500"
                                                placeholder="seu@email.com"
                                            />
                                        </div>

                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* password */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Senha
                                        </label>

                                        <div className="relative">
                                            <Lock
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500"
                                                placeholder="••••••••"
                                            />
                                        </div>

                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* remember */}
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    'remember',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-slate-300"
                                        />

                                        <span className="text-sm text-slate-600">
                                            Permanecer conectado
                                        </span>
                                    </label>

                                    {/* submit */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing && (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        )}

                                        Entrar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}