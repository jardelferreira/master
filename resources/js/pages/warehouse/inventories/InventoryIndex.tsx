import { Head, usePage } from '@inertiajs/react';
import StockLayout from '@/pages/layouts/StockLayout';

// ─── Types ───────────────────────────────────────────────────────────────────

type InventorySummary = {
    id: number;
    name: string;
    project: { id: number; name: string };
    due_date: string | null;
    status: {
        value: string;
        label: string;
        badge: string;
    };
    progress: {
        total: number;
        counted: number;
        pending: number;
        percent: number;
    };
};

type Props = {
    inventories: InventorySummary[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
    open:      { pill: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-500' },
    finished:  { pill: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-500' },
    approved:  { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    cancelled: { pill: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
};

function statusStyles(value: string) {
    return STATUS_STYLES[value] ?? STATUS_STYLES['open'];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InventoryIndex() {
    const { inventories } = usePage<Props>().props;

    const open      = inventories.filter((i) => i.status.value === 'open');
    const others    = inventories.filter((i) => i.status.value !== 'open');

    return (
        <>
            <Head title="Meus Inventários" />

            <div className="min-h-dvh bg-slate-50 px-4 pb-10 pt-6">

                {/* ── Header ────────────────────────────────────────────── */}
                <div className="mb-6 flex items-start gap-3">
                    <a
                        href={route('warehouse.index')}
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </a>

                    <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                        Almoxarifado · Inventário
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-blue-950">
                        Meus Inventários
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Selecione um inventário para iniciar a conferência.
                    </p>
                    </div>
                </div>

                {inventories.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-6">

                        {/* Inventários abertos */}
                        {open.length > 0 && (
                            <Section title="Em aberto">
                                {open.map((inv) => (
                                    <InventoryCard key={inv.id} inventory={inv} />
                                ))}
                            </Section>
                        )}

                        {/* Outros */}
                        {others.length > 0 && (
                            <Section title="Outros">
                                {others.map((inv) => (
                                    <InventoryCard key={inv.id} inventory={inv} dimmed />
                                ))}
                            </Section>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

// ─── Section ─────────────────────────────────────────────────────────────────

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {title}
            </p>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

// ─── Card de inventário ───────────────────────────────────────────────────────

function InventoryCard({
    inventory: inv,
    dimmed = false,
}: {
    inventory: InventorySummary;
    dimmed?: boolean;
}) {
    const { pill, dot } = statusStyles(inv.status.value);
    const isOpen = inv.status.value === 'open';

    return (
        <a
            href={route('warehouse.inventories.show', inv.id)}
            className={`block rounded-2xl border bg-white p-4 shadow-sm transition active:scale-[0.99] active:bg-slate-50 ${
                dimmed ? 'opacity-60' : ''
            }`}
        >
            {/* Linha superior: nome + status */}
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-blue-950">
                        {inv.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                        {inv.project.name}
                    </p>
                </div>

                <span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${pill}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                    {inv.status.label}
                </span>
            </div>

            {/* Barra de progresso */}
            <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span>
                        {inv.progress.counted} de {inv.progress.total} itens contados
                    </span>
                    <span className="font-semibold text-blue-950">
                        {inv.progress.percent}%
                    </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full transition-all ${
                            inv.progress.percent === 100
                                ? 'bg-emerald-500'
                                : 'bg-blue-500'
                        }`}
                        style={{ width: `${inv.progress.percent}%` }}
                    />
                </div>
            </div>

            {/* Rodapé: prazo + pendentes */}
            <div className="mt-3 flex items-center justify-between">
                {inv.due_date ? (
                    <p className="text-xs text-slate-400">
                        Prazo:{' '}
                        <span className="font-medium text-slate-600">
                            {inv.due_date}
                        </span>
                    </p>
                ) : (
                    <span />
                )}

                <div className="flex items-center gap-1">
                    {inv.progress.pending > 0 && isOpen && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            {inv.progress.pending} pendente{inv.progress.pending > 1 ? 's' : ''}
                        </span>
                    )}

                    {/* Seta */}
                    {isOpen && (
                        <svg
                            className="text-slate-300"
                            width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    )}
                </div>
            </div>
        </a>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <svg
                    className="text-blue-400"
                    width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">
                Nenhum inventário atribuído
            </p>
            <p className="mt-1 text-xs text-slate-400">
                Você será notificado quando um inventário for vinculado à sua conta.
            </p>
        </div>
    );
}