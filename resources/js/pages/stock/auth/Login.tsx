import { Head, useForm } from '@inertiajs/react';
import {
    Mail,
    Lock,
    Loader2,
    Package,
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

            <div className="min-h-screen bg-slate-100">

                <div className="grid min-h-screen lg:grid-cols-2">

                    {/* ==========================================
                     * BRANDING / EMPRESA
                     * ========================================== */}
                    <div
                        className="
                            relative
                            hidden
                            overflow-hidden
                            lg:flex
                            flex-col
                            justify-between
                            bg-[#172B36]
                            p-12
                        "
                    >
                        {/* Detalhes decorativos */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full border border-white/10" />
                            <div className="absolute top-24 left-20 h-72 w-72 rounded-full border border-white/10" />
                            <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full border border-white/5" />
                        </div>

                        <div className="relative z-10">

                            {/* LOGO */}
                            <div className="mb-10">
                                <img
                                    src="/images/planes-fundobranco.png"
                                    alt="Planes Engenharia"
                                    className="h-20 w-auto"
                                />
                            </div>

                            <div className="max-w-lg">
                                <h1 className="text-5xl font-bold leading-tight text-white">
                                    Inteligência para
                                    <br />
                                    construir o futuro.
                                </h1>

                                <p className="mt-6 text-lg text-white/70">
                                    Plataforma corporativa para consulta de
                                    materiais, estoque e movimentações dos
                                    projetos da empresa.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-sm text-white/50">
                                Planes Engenharia
                            </p>
                        </div>
                    </div>

                    {/* ==========================================
                     * LOGIN
                     * ========================================== */}
                    <div className="flex items-center justify-center px-6 py-12">

                        <div className="w-full max-w-md">

                            {/* MOBILE LOGO */}
                            <div className="mb-8 flex justify-center lg:hidden">
                                <img
                                    src="/images/planes-logo.svg"
                                    alt="Planes Engenharia"
                                    className="h-16 w-auto"
                                />
                            </div>

                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-8
                                    shadow-xl
                                    shadow-slate-200/50
                                "
                            >
                                {/* Cabeçalho */}
                                <div className="mb-8 text-center">

                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                                        <Package
                                            size={24}
                                            className="text-[#172B36]"
                                        />
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Consulta de Estoque
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Acesse utilizando suas credenciais
                                        corporativas.
                                    </p>
                                </div>

                                <form
                                    onSubmit={submit}
                                    className="space-y-5"
                                >
                                    {/* EMAIL */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            E-mail
                                        </label>

                                        <div className="relative">
                                            <Mail
                                                size={18}
                                                className="
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-slate-400
                                                "
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
                                                    focus:border-[#172B36]
                                                    focus:ring-4
                                                    focus:ring-slate-100
                                                "
                                            />
                                        </div>

                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* SENHA */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Senha
                                        </label>

                                        <div className="relative">
                                            <Lock
                                                size={18}
                                                className="
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-slate-400
                                                "
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
                                                    focus:border-[#172B36]
                                                    focus:ring-4
                                                    focus:ring-slate-100
                                                "
                                            />
                                        </div>

                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* BOTÃO */}
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
                                            bg-[#172B36]
                                            px-5
                                            py-3
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-[#223744]
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
                                        Área restrita para colaboradores
                                        autorizados.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}