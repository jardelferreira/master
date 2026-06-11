import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { RotateCcw } from 'lucide-react';

import WarehouseLayout from '@/pages/layouts/WarehouseLayout';
import { DataTable } from '@/pages/components/DataTable';
import WarehouseStockMovementModal, {
    ProjectUser,
} from '@/pages/components/warehouse/WarehouseStockMovementModal';

type Project = {
    id: number;
    name: string;
};

type Movement = {
    id: number;
    type: string;
    direction: 'in' | 'out';
    quantity: number;
    performed_at: string;
    notes?: string | null;

    stock_id: number;

    product: {
        id: number;
        name: string;
        unit?: string | null;
    };

    sector?: {
        id: number;
        name: string;
    } | null;

    user?: {
        id: number;
        name: string;
    } | null;

    employee?: {
        id: number;
        name: string;
    } | null;

    team?: {
        id: number;
        name: string;
    } | null;

    returned_quantity?: number;

    net_quantity?: number;

    parent_movement_id?: number | null;

    parent_type?: string | null;
};

type Props = {
    project: Project;
    movements: Movement[];
    employees: { id: number; name: string }[];
    teams: { id: number; name: string; employees: { id: number; name: string }[] }[];
    applicationAreas: { id: number; name: string }[];
};

export default function WarehouseMovements() {
    const { project, movements, employees, teams, applicationAreas } =
        usePage<Props>().props;

    const [returnStock, setReturnStock] =
        useState<{ id: number; product: { id: number; name: string; unit?: string | null }; stock_quantity: number; project_id: number } | null>(null);

    const [lockedMovementId, setLockedMovementId] =
        useState<number | null>(null);

    const [projectUsers, setProjectUsers] =
        useState<ProjectUser[]>([]);

    const [loadingUsers, setLoadingUsers] =
        useState(false);

    useEffect(() => {
        setLoadingUsers(true);
        axios
            .get(route('warehouse.projects.users', project.id))
            .then((res) => setProjectUsers(res.data))
            .finally(() => setLoadingUsers(false));
    }, [project.id]);

    function openReturn(movement: Movement) {
        setReturnStock({
            id: movement.stock_id,
            product: movement.product,
            stock_quantity: movement.net_quantity ?? movement.quantity,
            project_id: project.id,
        });
        setLockedMovementId(movement.id);
    }

    function closeReturn() {
        setReturnStock(null);
        setLockedMovementId(null);
    }

    const columns: ColumnDef<Movement>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => {
                const movement = row.original;
                const isEntry =
                    movement.type === 'entry';
                const isReturn =
                    movement.type === 'return';
                const isAdjust =
                    movement.type === 'adjust';
                const isLoss =
                    movement.type === 'loss';

                if (isEntry || isReturn || isAdjust || isLoss) {
                    return null;
                }

                const available = movement.net_quantity ?? movement.quantity;
                const depleted = available <= 0;

                return (
                    <button
                        type="button"
                        onClick={() => !depleted && openReturn(movement)}
                        disabled={depleted}
                        title={depleted ? 'Quantidade disponível esgotada' : 'Registrar devolução'}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${depleted
                            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                    >
                        <RotateCcw size={12} />
                        Devolver
                    </button>
                );
            },
        },
        {
            accessorFn: (row) => row.product.name,
            id: 'product',
            header: 'Produto',
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-slate-900">
                        {row.original.product.name}
                    </p>

                    <p className="text-xs text-slate-500">
                        {row.original.product.unit ?? '—'}
                    </p>
                </div>
            ),
        },

        {
            accessorFn: (row) =>
                row.sector?.name ?? '',
            id: 'sector',
            header: 'Setor',
            cell: ({ row }) =>
                row.original.sector?.name ?? '—',
        },
        {
            accessorKey: 'net_quantity',
            header: 'Saldo',
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.net_quantity ??
                        row.original.quantity}
                </span>
            ),
        },
        {
            accessorKey: 'type',
            header: 'Tipo',
            cell: ({ row }) => (
                <MovementTypeBadge
                    type={row.original.type}
                />
            ),
        },

        {
            accessorKey: 'direction',
            header: 'Direção',
            cell: ({ row }) => (
                <DirectionBadge
                    direction={
                        row.original.direction
                    }
                />
            ),
        },

        {
            accessorKey: 'quantity',
            header: 'Quantidade',
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.quantity}
                </span>
            ),
        },
        {
            accessorFn: row =>
                row.employee?.name ?? '',
            id: 'employee',
            header: 'Colaborador',
            cell: ({ row }) =>
                row.original.employee?.name ?? '—',
        },
        {
            accessorFn: row =>
                row.team?.name ?? '',
            id: 'team',
            header: 'Equipe',
            cell: ({ row }) =>
                row.original.team?.name ?? '—',
        },

        {
            accessorKey: 'parent_movement_id',
            header: 'Origem',
            cell: ({ row }) => {

                if (
                    !row.original.parent_movement_id
                ) {
                    return '—';
                }

                return (
                    <span>
                        #
                        {
                            row.original
                                .parent_movement_id
                        }
                    </span>
                );
            },
        },
        {
            accessorFn: (row) =>
                row.user?.name ?? '',
            id: 'user',
            header: 'Operador',
            cell: ({ row }) =>
                row.original.user?.name ??
                'Sistema',
        },

        {
            accessorKey: 'performed_at',
            header: 'Data',
            cell: ({ row }) => (
                <span className="text-sm">
                    {formatDate(
                        row.original.performed_at,
                    )}
                </span>
            ),
        },

        {
            accessorFn: (row) =>
                row.notes ?? '',
            id: 'notes',
            header: 'Observações',
            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {row.original.notes ?? '—'}
                </span>
            ),
        },
    ];

    return (
        <>
            <Head
                title={`Movimentações · ${project.name}`}
            />

            <div className="space-y-6">
                <div className='bg-white p-2 m-2 rounded'>
                    <p className="text-xs uppercase text-blue-800">
                        Almoxarifado
                    </p>

                    <h1 className="text-3xl font-bold text-blue-900">
                        Movimentações
                    </h1>

                    <p className="mt-2 text-sm ">
                        {project.name}
                    </p>
                </div>

                <DataTable<Movement>
                    data={movements}
                    columns={columns}
                    searchPlaceholder="Buscar produto, setor, operador ou observações..."
                />
            </div>

            <WarehouseStockMovementModal
                open={!!returnStock}
                movementType="return"
                onClose={closeReturn}
                projectId={project.id}
                stock={returnStock}
                stocks={[]}
                projectUsers={projectUsers}
                loadingUsers={loadingUsers}
                employees={employees}
                teams={teams}
                applicationAreas={applicationAreas}
                lockedMovementId={lockedMovementId}
            />
        </>
    );
}

WarehouseMovements.layout = (
    page: React.ReactNode,
) => (
    <WarehouseLayout>{page}</WarehouseLayout>
);

function MovementTypeBadge({
    type,
}: {
    type: string;
}) {
    const labels: Record<string, string> = {
        consumption: 'Consumo',
        transfer: 'Transferência',
        assignment: 'Atribuição',
        adjust: 'Ajuste',
        return: 'Devolução',
        loss: 'Perda',
        entry: 'Entrada',
    };

    return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {labels[type] ?? type}
        </span>
    );
}

function DirectionBadge({
    direction,
}: {
    direction: 'in' | 'out';
}) {
    if (direction === 'in') {
        return (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Entrada
            </span>
        );
    }

    return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Saída
        </span>
    );
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(date));
}