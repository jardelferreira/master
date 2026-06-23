import { PropsWithChildren } from 'react';
import { router, usePage } from '@inertiajs/react';
import { LogOut, Package } from 'lucide-react';

type PageProps = {
    user?: {
        name: string;
    };
};

export default function ConsultaLayout({
    children,
}: PropsWithChildren) {
    const { user } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-slate-50">

            {/* HEADER */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto h-14 px-6 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                h-9 w-9
                                rounded-xl
                                bg-blue-600
                                text-white
                                flex
                                items-center
                                justify-center
                                shadow-sm
                            "
                        >
                            <Package size={18} />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">
                                Estoque Master
                            </p>

                            <h1 className="text-sm font-semibold text-slate-900">
                                Consulta de Estoque
                            </h1>
                        </div>
                    </div>

                    {user && (
                        <div className="flex items-center gap-3">

                            <span className="hidden md:block text-sm text-slate-600">
                                {user.name}
                            </span>

                            <button
                                onClick={() =>
                                    router.post(route('stock.logout'))
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                <LogOut size={16} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* CONTEÚDO */}
            <main className="max-w-7xl mx-auto p-6">
                {children}
            </main>
        </div>
    );
}