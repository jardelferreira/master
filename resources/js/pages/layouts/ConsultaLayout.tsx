import { PropsWithChildren } from 'react';
import { router, usePage } from '@inertiajs/react';
import { LogOut, Package } from 'lucide-react';

type PageProps = {
    user?: { name: string };
};

export default function ConsultaLayout({ children }: PropsWithChildren) {
    const { user } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">

                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500">
                            <Package size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold tracking-wide text-white/90">
                            Consulta de Estoque
                        </span>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4">
                            <span className="hidden text-xs text-white/40 sm:block">
                                {user.name}
                            </span>
                            <button
                                onClick={() => router.post(route('stock.logout'))}
                                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white/90"
                            >
                                <LogOut size={12} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* ── Content ────────────────────────────────────────────────── */}
            <main className="mx-auto max-w-5xl px-5 py-8">
                {children}
            </main>
        </div>
    );
}