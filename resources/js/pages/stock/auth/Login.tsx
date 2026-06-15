import { Head, useForm } from '@inertiajs/react';
import {
    Mail,
    Lock,
    Loader2,
} from 'lucide-react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function StockLogin() {
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

        post(route('stock.login.store'));
    }

    return (
        <>
            <Head title="Consulta de Estoque" />

            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
                <div className="w-full max-w-md">

                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-24 w-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
                            <span className="text-sm text-slate-400">
                                LOGO DA EMPRESA
                            </span>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Consulta de Estoque
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Área interna para consulta de materiais e saldos.
                            </p>
                        </div>

                        <form
                            onSubmit={submit}
                            className="space-y-5"
                        >
                            {/* Email */}
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
                                        placeholder="Digite seu e-mail"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-300
                                            bg-white
                                            py-3
                                            pl-11
                                            pr-4
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:ring-4
                                            focus:ring-blue-100
                                        "
                                    />
                                </div>

                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Senha */}
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
                                        placeholder="Digite sua senha"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-300
                                            bg-white
                                            py-3
                                            pl-11
                                            pr-4
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:ring-4
                                            focus:ring-blue-100
                                        "
                                    />
                                </div>

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="
                                    inline-flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-5
                                    py-3
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                    disabled:opacity-50
                                "
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

                        <div className="mt-6 border-t border-slate-100 pt-4">
                            <p className="text-center text-xs text-slate-400">
                                Área restrita para colaboradores autorizados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}