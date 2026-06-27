import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ClipboardList, Eye, Plus } from 'lucide-react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Inventory {
    id: number;
    name: string;
    status: string;
    due_date: string | null;
    items_count: number;
    project?: { id: number; name: string };
    creator?: { id: number; name: string };
}

interface Props {
    inventories: Inventory[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
    open:        'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    finished:    'bg-purple-100 text-purple-700',
    approved:    'bg-emerald-100 text-emerald-700',
    cancelled:   'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
    open:        'Aberto',
    in_progress: 'Em Andamento',
    finished:    'Finalizado',
    approved:    'Aprovado',
    cancelled:   'Cancelado',
};

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'
            }`}
        >
            {STATUS_LABELS[status] ?? status}
        </span>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Index({ inventories }: Props) {

    // ── Métricas ─────────────────────────────────────────────────────────────
    const total      = inventories.length;
    const open       = inventories.filter((i) => i.status === 'open').length;
    const inProgress = inventories.filter((i) => i.status === 'in_progress').length;
    const finished   = inventories.filter((i) => i.status === 'finished' || i.status === 'approved').length;

    // ── Colunas desktop ──────────────────────────────────────────────────────
    const columns: ColumnDef<Inventory>[] = [
        {
            accessorKey: 'name',
            header: 'Inventário',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900">{row.original.name}</span>
            ),
        },
        {
            accessorFn: (row) => row.project?.name,
            id: 'project',
            header: 'Projeto',
            cell: ({ getValue }) => (
                <span className="text-gray-600">{getValue<string>() ?? '—'}</span>
            ),
        },
        {
            accessorKey: 'items_count',
            header: 'Itens',
            cell: ({ getValue }) => (
                <span className="tabular-nums font-medium">{getValue<number>()}</span>
            ),
        },
        {
            accessorFn: (row) => row.creator?.name,
            id: 'creator',
            header: 'Criado por',
            cell: ({ getValue }) => (
                <span className="text-gray-600">{getValue<string>() ?? '—'}</span>
            ),
        },
        {
            accessorKey: 'due_date',
            header: 'Prazo',
            cell: ({ row }) =>
                row.original.due_date
                    ? new Date(row.original.due_date).toLocaleDateString('pt-BR')
                    : <span className="text-gray-400">—</span>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <Link
                    href={route('admin.inventories.show', row.original.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
                >
                    <Eye size={15} />
                    Visualizar
                </Link>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <Head title="Inventários" />

            <div className="space-y-5 p-2">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-core-50">
                            <ClipboardList size={20} className="text-core-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Inventários
                            </h1>
                            <p className="text-sm text-gray-500">
                                Gerencie e acompanhe os inventários.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('admin.inventories.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-core-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-core-700 sm:w-auto w-full"
                    >
                        <Plus size={16} />
                        Novo Inventário
                    </Link>
                </div>

                {/* ── Métricas ───────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    <MetricCard title="Total"        value={total}      color="gray" />
                    <MetricCard title="Abertos"      value={open}       color="blue" />
                    <MetricCard title="Em Andamento" value={inProgress} color="amber" />
                    <MetricCard title="Finalizados"  value={finished}   color="green" />
                </div>

                {/* ── Tabela desktop ─────────────────────────────────────── */}
                <div className="hidden md:block">
                    <DataTable
                        data={inventories}
                        columns={columns}
                        searchPlaceholder="Buscar inventário..."
                        enableExport
                        enablePrint
                        exportFileName="inventarios"
                    />
                </div>

                {/* ── Lista mobile ───────────────────────────────────────── */}
                <div className="space-y-3 md:hidden">
                    {inventories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
                            <ClipboardList size={32} className="mb-3 text-gray-300" />
                            <p className="text-sm text-gray-500">
                                Nenhum inventário encontrado.
                            </p>
                        </div>
                    ) : (
                        inventories.map((inventory) => (
                            <MobileCard key={inventory.id} inventory={inventory} />
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

// ─── Mobile card ─────────────────────────────────────────────────────────────

function MobileCard({ inventory }: { inventory: Inventory }) {
    return (
        <Link
            href={route('admin.inventories.show', inventory.id)}
            className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition active:bg-gray-50"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">
                        {inventory.name}
                    </p>
                    {inventory.project && (
                        <p className="mt-0.5 text-xs text-gray-500">
                            {inventory.project.name}
                        </p>
                    )}
                </div>
                <StatusBadge status={inventory.status} />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                    <span>
                        <span className="font-semibold text-gray-700">
                            {inventory.items_count}
                        </span>{' '}
                        iten{inventory.items_count !== 1 ? 's' : ''}
                    </span>

                    {inventory.due_date && (
                        <span>
                            Prazo:{' '}
                            <span className="font-medium text-gray-700">
                                {new Date(inventory.due_date).toLocaleDateString('pt-BR')}
                            </span>
                        </span>
                    )}
                </div>

                <svg
                    className="shrink-0 text-gray-300"
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                >
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </div>

            {inventory.creator && (
                <p className="mt-2 text-xs text-gray-400">
                    Criado por {inventory.creator.name}
                </p>
            )}
        </Link>
    );
}

// ─── Metric card ─────────────────────────────────────────────────────────────

type MetricColor = 'gray' | 'blue' | 'amber' | 'green';

const METRIC_STYLES: Record<MetricColor, { wrap: string; label: string; value: string }> = {
    gray:  { wrap: 'bg-white border-gray-100',      label: 'text-gray-500',   value: 'text-gray-900' },
    blue:  { wrap: 'bg-blue-50 border-blue-100',    label: 'text-blue-600',   value: 'text-blue-950' },
    amber: { wrap: 'bg-amber-50 border-amber-100',  label: 'text-amber-600',  value: 'text-amber-900' },
    green: { wrap: 'bg-emerald-50 border-emerald-100', label: 'text-emerald-600', value: 'text-emerald-900' },
};

function MetricCard({
    title,
    value,
    color = 'gray',
}: {
    title: string;
    value: number;
    color?: MetricColor;
}) {
    const s = METRIC_STYLES[color];
    return (
        <div className={`rounded-2xl border p-4 shadow-sm ${s.wrap}`}>
            <p className={`text-xs font-medium uppercase tracking-wide ${s.label}`}>
                {title}
            </p>
            <p className={`mt-1 text-3xl font-bold tabular-nums ${s.value}`}>
                {value}
            </p>
        </div>
    );
}