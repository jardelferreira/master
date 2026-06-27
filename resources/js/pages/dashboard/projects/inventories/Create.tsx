import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';

type Project = {
    id: number;
    name: string;
};

type Sector = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
};

type Stock = {
    id: number;
    quantity: number;

    product: {
        id: number;
        name: string;
        sku: string | null;
        unit: string | null;
    };
};

interface Props {
    projects: Project[];
}

export default function Create({
    projects,
}: Props) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: '',

        project_id: '',

        sector_id: '',

        due_date: '',

        blind_count: false,

        notes: '',

        user_ids: [] as number[],

        stock_ids: [] as number[],
    });

    const [sectors, setSectors] = useState<
        Sector[]
    >([]);

    const [users, setUsers] = useState<User[]>(
        [],
    );

    const [stocks, setStocks] = useState<
        Stock[]
    >([]);

    const [loadingProjectData, setLoadingProjectData] =
        useState(false);

    const [loadingStocks, setLoadingStocks] =
        useState(false);

    const columns = useMemo<
        ColumnDef<Stock>[]
    >(
        () => [
            {
                accessorFn: (row) =>
                    row.product.name,
                id: 'product_name',
                header: 'Produto',
            },

            {
                accessorFn: (row) =>
                    row.product.sku,
                id: 'sku',
                header: 'SKU',
            },

            {
                accessorFn: (row) =>
                    row.product.unit,
                id: 'unit',
                header: 'Unidade',
            },

            {
                accessorKey: 'quantity',
                header: 'Quantidade Atual',

                cell: ({ row }) =>
                    Number(
                        row.original.quantity,
                    ).toLocaleString(
                        'pt-BR',
                    ),
            },
        ],
        [],
    );

    async function handleProjectChange(
        projectId: string,
    ) {
        setData('project_id', projectId);

        setData('sector_id', '');

        setData('user_ids', []);

        setData('stock_ids', []);

        setStocks([]);

        if (!projectId) {
            setUsers([]);
            setSectors([]);
            return;
        }

        setLoadingProjectData(true);

        try {
            const [sectorsResponse, usersResponse] =
                await Promise.all([
                    axios.get(
                        route(
                            'inventories.sectors',
                            projectId,
                        ),
                    ),

                    axios.get(
                        route(
                            'inventories.users',
                            projectId,
                        ),
                    ),
                ]);

            setSectors(
                sectorsResponse.data,
            );

            setUsers(
                usersResponse.data,
            );
        } finally {
            setLoadingProjectData(false);
        }
    }

    async function handleSectorChange(
        sectorId: string,
    ) {
        setData('sector_id', sectorId);

        setData('stock_ids', []);

        setStocks([]);

        if (
            !data.project_id ||
            !sectorId
        ) {
            return;
        }

        setLoadingStocks(true);

        try {
            const response = await axios.get(
                route(
                    'inventories.stocks',
                    {
                        project:
                            data.project_id,
                        sector: sectorId,
                    },
                ),
            );

            setStocks(response.data);
        } finally {
            setLoadingStocks(false);
        }
    }

    function toggleUser(
        userId: number,
    ) {
        const exists =
            data.user_ids.includes(userId);

        if (exists) {
            setData(
                'user_ids',
                data.user_ids.filter(
                    (id) => id !== userId,
                ),
            );

            return;
        }

        setData('user_ids', [
            ...data.user_ids,
            userId,
        ]);
    }

    function submit(
        e: React.FormEvent,
    ) {
        e.preventDefault();

        post(route('inventories.store'));
    }

    return (
        <DashboardLayout>
            <Head title="Novo Inventário" />

            <form
                onSubmit={submit}
                className="space-y-6"
            >
                {/* Dados Gerais */}

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold">
                        Informações Gerais
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Nome
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData(
                                        'name',
                                        e.target
                                            .value,
                                    )
                                }
                                className="w-full rounded-xl border px-4 py-2"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {
                                        errors.name
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Prazo
                            </label>

                            <input
                                type="date"
                                value={
                                    data.due_date
                                }
                                onChange={(e) =>
                                    setData(
                                        'due_date',
                                        e.target
                                            .value,
                                    )
                                }
                                className="w-full rounded-xl border px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Projeto
                            </label>

                            <select
                                value={
                                    data.project_id
                                }
                                onChange={(e) =>
                                    handleProjectChange(
                                        e.target
                                            .value,
                                    )
                                }
                                className="w-full rounded-xl border px-4 py-2"
                            >
                                <option value="">
                                    Selecione
                                </option>

                                {projects.map(
                                    (
                                        project,
                                    ) => (
                                        <option
                                            key={
                                                project.id
                                            }
                                            value={
                                                project.id
                                            }
                                        >
                                            {
                                                project.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Setor
                            </label>

                            <select
                                value={
                                    data.sector_id
                                }
                                disabled={
                                    loadingProjectData
                                }
                                onChange={(e) =>
                                    handleSectorChange(
                                        e.target
                                            .value,
                                    )
                                }
                                className="w-full rounded-xl border px-4 py-2"
                            >
                                <option value="">
                                    Selecione
                                </option>

                                {sectors.map(
                                    (
                                        sector,
                                    ) => (
                                        <option
                                            key={
                                                sector.id
                                            }
                                            value={
                                                sector.id
                                            }
                                        >
                                            {
                                                sector.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    data.blind_count
                                }
                                onChange={(e) =>
                                    setData(
                                        'blind_count',
                                        e.target
                                            .checked,
                                    )
                                }
                            />

                            <span>
                                Inventário
                                Cego
                            </span>
                        </label>
                    </div>

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium">
                            Observações
                        </label>

                        <textarea
                            rows={4}
                            value={data.notes}
                            onChange={(e) =>
                                setData(
                                    'notes',
                                    e.target
                                        .value,
                                )
                            }
                            className="w-full rounded-xl border px-4 py-2"
                        />
                    </div>
                </div>

                {/* Responsáveis */}

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold">
                        Responsáveis
                    </h2>

                    <div className="grid gap-3 md:grid-cols-3">
                        {users.map(
                            (user) => (
                                <label
                                    key={user.id}
                                    className="flex items-center gap-3 rounded-xl border p-3"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.user_ids.includes(
                                            user.id,
                                        )}
                                        onChange={() =>
                                            toggleUser(
                                                user.id,
                                            )
                                        }
                                    />

                                    {user.name}
                                </label>
                            ),
                        )}
                    </div>
                </div>

                {/* Estoques */}

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Estoques
                        </h2>

                        <span className="text-sm text-gray-500">
                            {
                                data.stock_ids
                                    .length
                            }{' '}
                            selecionados
                        </span>
                    </div>

                    <DataTable
                        data={stocks}
                        columns={columns}
                        searchPlaceholder="Buscar produto..."
                        enableRowSelection
                        onRowSelectionChange={(
                            rows,
                        ) =>
                            setData(
                                'stock_ids',
                                rows.map(
                                    (
                                        row,
                                    ) =>
                                        row.id,
                                ),
                            )
                        }
                    />
                </div>

                {/* Rodapé */}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="rounded-xl border px-6 py-2"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={
                            processing
                        }
                        className="rounded-xl bg-core-600 px-6 py-2 text-white"
                    >
                        Criar Inventário
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}