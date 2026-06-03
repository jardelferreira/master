import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Activity,
    Boxes,
    ArrowRight,
    Package,
    RefreshCcw,
    Wrench,
} from 'lucide-react';

import WarehouseLayout from '@/pages/layouts/WarehouseLayout';

type Project = {
    id: number;
    uuid: string;
    name: string;
};

type Stats = {
    stocks_count: number;
    critical_count: number;
    movements_today: number;
};

type Movement = {
    id: number;
    type: string;
    direction: 'in' | 'out';
    quantity: number;

    product: {
        id: number;
        name: string;
    };

    user?: {
        id: number;
        name: string;
    } | null;
};

type Props = {
    project: Project;
    stats: Stats;
    recent_movements: Movement[];
};

const CARD =
    'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm';

export default function WarehouseDashboard() {
    const {
        project,
        stats,
        recent_movements,
    } = usePage<Props>().props;

    return (
        <>
            <Head title={`Warehouse · ${project.name}`} />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            Warehouse
                        </p>

                        <h1 className="text-3xl font-bold text-slate-900">
                            {project.name}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Dashboard operacional do projeto
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() =>
                                router.visit(
                                    route(
                                        'warehouse.projects.stocks',
                                        project.id,
                                    ),
                                )
                            }
                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
                        >
                            <Boxes size={18} />
                            Operar Estoque
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <StatCard
                        icon={<Package size={20} />}
                        label="Produtos em estoque"
                        value={stats.stocks_count}
                    />

                    <StatCard
                        icon={<AlertTriangle size={20} />}
                        label="Estoque crítico"
                        value={stats.critical_count}
                    />

                    <StatCard
                        icon={<Activity size={20} />}
                        label="Movimentações hoje"
                        value={stats.movements_today}
                    />
                </div>

                {/* Quick actions */}
                <div className={CARD}>
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            Ações rápidas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <QuickAction
                            icon={<Boxes size={18} />}
                            title="Estoque"
                            description="Consultar e operar estoque."
                            onClick={() =>
                                router.visit(
                                    route(
                                        'warehouse.projects.stocks',
                                        project.id,
                                    ),
                                )
                            }
                        />

                        <QuickAction
                            icon={<RefreshCcw size={18} />}
                            title="Transferência"
                            description="Mobilizar materiais."
                            disabled
                        />

                        <QuickAction
                            icon={<Wrench size={18} />}
                            title="Ajustes"
                            description="Corrigir divergências."
                            disabled
                        />
                    </div>
                </div>

                {/* Recent movements */}
                <div className={CARD}>
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            Últimas movimentações
                        </p>
                    </div>

                    {recent_movements.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                            <p className="text-sm text-slate-500">
                                Nenhuma movimentação registrada.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recent_movements.map(
                                (movement) => (
                                    <div
                                        key={movement.id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {
                                                    movement
                                                        .product
                                                        .name
                                                }
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {
                                                    movement.type
                                                }{' '}
                                                •{' '}
                                                {movement.user
                                                    ?.name ??
                                                    'Sistema'}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p
                                                className={`font-bold ${
                                                    movement.direction ===
                                                    'in'
                                                        ? 'text-emerald-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {movement.direction ===
                                                'in'
                                                    ? '+'
                                                    : '-'}
                                                {
                                                    movement.quantity
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

WarehouseDashboard.layout = (page: React.ReactNode) => (
    <WarehouseLayout>{page}</WarehouseLayout>
);

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className={CARD}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {label}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function QuickAction({
    icon,
    title,
    description,
    onClick,
    disabled = false,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <div className="flex items-start justify-between">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                    {icon}
                </div>

                <ArrowRight size={16} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                {description}
            </p>
        </button>
    );
}