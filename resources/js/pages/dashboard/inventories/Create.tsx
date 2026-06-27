import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type Project = {
    id: number;
    name: string;
};

type Sector = {
    id: number;
    name: string;
};

type Stock = {
    id: number;
    stock_quantity: number;
    sector: Sector;
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

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function Badge({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {label}
        </span>
    );
}

function MultiSelect({
    label,
    options,
    selected,
    onChange,
    placeholder = 'Todos',
}: {
    label: string;
    options: { id: number; name: string }[];
    selected: number[];
    onChange: (ids: number[]) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function toggle(id: number) {
        onChange(
            selected.includes(id)
                ? selected.filter((s) => s !== id)
                : [...selected, id],
        );
    }

    const labelText =
        selected.length === 0
            ? placeholder
            : selected.length === options.length
              ? 'Todos'
              : `${selected.length} selecionado${selected.length > 1 ? 's' : ''}`;

    return (
        <div className="relative" ref={ref}>
            <span className="mb-1 block text-xs font-medium text-gray-500">
                {label}
            </span>

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:border-gray-400"
            >
                <span>{labelText}</span>
                <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border bg-white shadow-lg">
                    {options.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-gray-400">Sem opções</p>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() =>
                                    onChange(
                                        selected.length === options.length
                                            ? []
                                            : options.map((o) => o.id),
                                    )
                                }
                                className="w-full px-3 py-2 text-left text-xs font-medium text-core-600 hover:bg-gray-50"
                            >
                                {selected.length === options.length ? 'Desmarcar todos' : 'Selecionar todos'}
                            </button>

                            <div className="max-h-48 overflow-y-auto border-t">
                                {options.map((opt) => (
                                    <label
                                        key={opt.id}
                                        className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(opt.id)}
                                            onChange={() => toggle(opt.id)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">{opt.name}</span>
                                    </label>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Componente principal
|--------------------------------------------------------------------------
*/

export default function Create({ projects }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        project_id: '' as string | number,
        due_date: '',
        blind_count: false,
        notes: '',
        user_ids: [] as number[],
        stock_ids: [] as number[],
    });

    // Dados carregados via axios
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loadingProject, setLoadingProject] = useState(false);

    // Filtros da tabela (multi-select)
    const [filterSectors, setFilterSectors] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    /*
    |--------------------------------------------------------------------------
    | Opções derivadas para os filtros
    |--------------------------------------------------------------------------
    */

    const sectorOptions = useMemo(() => {
        const map = new Map<number, string>();
        stocks.forEach((s) => map.set(s.sector.id, s.sector.name));
        return Array.from(map.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [stocks]);

    /*
    |--------------------------------------------------------------------------
    | Stocks filtrados (para a tabela)
    |--------------------------------------------------------------------------
    */

    const filteredStocks = useMemo(() => {
        return stocks.filter((s) => {
            const matchSector =
                filterSectors.length === 0 ||
                filterSectors.includes(s.sector.id);


            const matchSearch =
                searchText.trim() === '' ||
                s.product.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                (s.product.sku ?? '')
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                s.sector.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase());

            return matchSector  && matchSearch;
        });
    }, [stocks, filterSectors, searchText]);

    /*
    |--------------------------------------------------------------------------
    | Handlers
    |--------------------------------------------------------------------------
    */

    async function handleProjectChange(projectId: string) {
        // Reseta tudo em um único setData para evitar bug de múltiplos setData
        setData((prev) => ({
            ...prev,
            project_id: projectId,
            user_ids: [],
            stock_ids: [],
        }));

        setUsers([]);
        setStocks([]);
        setFilterSectors([]);
        setSearchText('');

        if (!projectId) return;

        setLoadingProject(true);

        try {
            const [usersRes, stocksRes] = await Promise.all([
                axios.get(route('admin.inventories.users', projectId)),
                axios.get(route('admin.inventories.stocks', projectId)),
            ]);

            setUsers(usersRes.data);
            setStocks(stocksRes.data);
        } finally {
            setLoadingProject(false);
        }
    }

    function toggleUser(userId: number) {
        setData(
            'user_ids',
            data.user_ids.includes(userId)
                ? data.user_ids.filter((id) => id !== userId)
                : [...data.user_ids, userId],
        );
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.inventories.store'));
    }

    /*
    |--------------------------------------------------------------------------
    | Validações inline para o botão salvar
    |--------------------------------------------------------------------------
    */

    const canSave =
        data.name.trim() !== '' &&
        data.project_id !== '' &&
        data.user_ids.length > 0 &&
        data.stock_ids.length > 0;

    const validationHints = useMemo(() => {
        const hints: string[] = [];
        if (!data.name.trim()) hints.push('nome');
        if (!data.project_id) hints.push('projeto');
        if (data.user_ids.length === 0) hints.push('responsável');
        if (data.stock_ids.length === 0) hints.push('item');
        return hints;
    }, [data]);

    /*
    |--------------------------------------------------------------------------
    | Colunas da tabela
    |--------------------------------------------------------------------------
    */

    const columns = useMemo<ColumnDef<Stock>[]>(
        () => [
            {
                accessorFn: (row) => row.sector.name,
                id: 'sector_name',
                header: 'Setor',
                cell: ({ getValue }) => (
                    <Badge label={getValue<string>()} />
                ),
            },
            {
                accessorFn: (row) => row.product.name,
                id: 'product_name',
                header: 'Produto',
            },
            {
                accessorFn: (row) => row.product.sku ?? '—',
                id: 'sku',
                header: 'SKU',
                cell: ({ getValue }) => (
                    <span className="font-mono text-xs text-gray-500">
                        {getValue<string>()}
                    </span>
                ),
            },
            {
                accessorFn: (row) => row.product.unit ?? '—',
                id: 'unit',
                header: 'Un.',
            },
            {
                id: 'stock_quantity',
                header: 'Qtd. atual',
                cell: ({ row }) =>
                    Number(row.original.stock_quantity).toLocaleString('pt-BR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3,
                    }),
            },
        ],
        [],
    );

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <DashboardLayout>
            <Head title="Novo Inventário" />

            <form onSubmit={submit} className="space-y-6">
                {/*
                |--------------------------------------------------------------
                | Cabeçalho com botão salvar
                |--------------------------------------------------------------
                */}

                <div className="flex items-center justify-between p-4 m-2 rounded-xl bg-white">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Novo Inventário
                        </h1>

                        {!canSave && validationHints.length > 0 && (
                            <p className="mt-1 text-sm text-gray-400">
                                Preencha:{' '}
                                {validationHints.join(', ')}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={route('admin.inventories.index')}
                            className="rounded-xl border px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Cancelar
                        </a>

                        <button
                            type="submit"
                            disabled={processing || !canSave}
                            title={
                                !canSave
                                    ? `Preencha: ${validationHints.join(', ')}`
                                    : undefined
                            }
                            className="rounded-xl bg-core-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-core-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Salvando...' : 'Criar Inventário'}
                        </button>
                    </div>
                </div>

                {/*
                |--------------------------------------------------------------
                | Informações Gerais
                |--------------------------------------------------------------
                */}

                <div className="rounded-2xl border bg-white p-6 shadow-sm m-2">
                    <h2 className="mb-5 text-base font-semibold text-gray-800">
                        Informações Gerais
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Nome */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Nome{' '}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Ex.: Inventário Geral — Junho 2026"
                                className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-core-500"
                            />

                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Prazo */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Prazo
                            </label>

                            <input
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData('due_date', e.target.value)
                                }
                                className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-core-500"
                            />
                        </div>

                        {/* Projeto */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Projeto{' '}
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                value={data.project_id}
                                disabled={loadingProject}
                                onChange={(e) =>
                                    handleProjectChange(e.target.value)
                                }
                                className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-core-500 disabled:bg-gray-50"
                            >
                                <option value="">Selecione o projeto</option>

                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            {errors.project_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.project_id}
                                </p>
                            )}
                        </div>

                        {/* Observações ocupa a coluna restante no md */}
                        <div className="md:row-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Observações
                            </label>

                            <textarea
                                rows={4}
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-core-500"
                            />
                        </div>

                        {/* Inventário Cego */}
                        <div className="flex items-center gap-3 rounded-xl border bg-gray-50 px-4 py-3">
                            <input
                                type="checkbox"
                                id="blind_count"
                                checked={data.blind_count}
                                onChange={(e) =>
                                    setData('blind_count', e.target.checked)
                                }
                                className="h-4 w-4 rounded"
                            />

                            <div>
                                <label
                                    htmlFor="blind_count"
                                    className="cursor-pointer text-sm font-medium text-gray-700"
                                >
                                    Inventário Cego
                                </label>

                                <p className="text-xs text-gray-400">
                                    Oculta a quantidade do sistema durante a
                                    contagem
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/*
                |--------------------------------------------------------------
                | Responsáveis
                |--------------------------------------------------------------
                */}

                <div className="rounded-2xl border bg-white p-6 shadow-sm m-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-800">
                            Responsáveis{' '}
                            <span className="text-red-500">*</span>
                        </h2>

                        {data.user_ids.length > 0 && (
                            <span className="text-sm text-gray-500">
                                {data.user_ids.length} selecionado
                                {data.user_ids.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {!data.project_id ? (
                        <p className="text-sm text-gray-400">
                            Selecione um projeto para ver os responsáveis.
                        </p>
                    ) : loadingProject ? (
                        <p className="text-sm text-gray-400">Carregando...</p>
                    ) : users.length === 0 ? (
                        <p className="text-sm text-gray-400">
                            Nenhum usuário encontrado neste projeto.
                        </p>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {users.map((user) => (
                                <label
                                    key={user.id}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                                        data.user_ids.includes(user.id)
                                            ? 'border-core-500 bg-core-50'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.user_ids.includes(user.id)}
                                        onChange={() => toggleUser(user.id)}
                                        className="rounded"
                                    />

                                    <span className="text-sm">{user.name}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {errors.user_ids && (
                        <p className="mt-2 text-xs text-red-500">
                            {errors.user_ids}
                        </p>
                    )}
                </div>

                {/*
                |--------------------------------------------------------------
                | Itens do Inventário
                |--------------------------------------------------------------
                */}

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    {/* Cabeçalho da seção com filtros e contador */}
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-800">
                                Itens do Inventário{' '}
                                <span className="text-red-500">*</span>
                            </h2>

                            <p className="mt-0.5 text-sm text-gray-400">
                                {data.stock_ids.length === 0
                                    ? 'Nenhum item selecionado'
                                    : `${data.stock_ids.length} item${data.stock_ids.length > 1 ? 'ns' : ''} selecionado${data.stock_ids.length > 1 ? 's' : ''}`}
                                {stocks.length > 0 &&
                                    ` de ${stocks.length} disponíveis`}
                            </p>
                        </div>

                        {/* Filtros — só aparecem quando há stocks */}
                        {stocks.length > 0 && (
                            <div className="flex flex-wrap items-end gap-3 md:flex-nowrap">
                                {/* Busca livre */}
                                <div>
                                    <span className="mb-1 block text-xs font-medium text-gray-500">
                                        Busca
                                    </span>

                                    <input
                                        type="text"
                                        value={searchText}
                                        onChange={(e) =>
                                            setSearchText(e.target.value)
                                        }
                                        placeholder="Produto, SKU ou setor..."
                                        className="w-52 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-core-500"
                                    />
                                </div>

                                {/* Filtro por setor */}
                                <div className="w-44">
                                    <MultiSelect
                                        label="Setor"
                                        options={sectorOptions}
                                        selected={filterSectors}
                                        onChange={setFilterSectors}
                                        placeholder="Todos os setores"
                                    />
                                </div>

                                {/* Limpar filtros */}
                                {(filterSectors.length > 0 ||
                                    searchText !== '') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFilterSectors([]);
                                            setSearchText('');
                                        }}
                                        className="rounded-xl border border-dashed px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
                                    >
                                        Limpar filtros
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tabela */}
                    {!data.project_id ? (
                        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed">
                            <p className="text-sm text-gray-400">
                                Selecione um projeto para ver os itens
                                disponíveis.
                            </p>
                        </div>
                    ) : loadingProject ? (
                        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed">
                            <p className="text-sm text-gray-400">
                                Carregando itens...
                            </p>
                        </div>
                    ) : stocks.length === 0 ? (
                        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed">
                            <p className="text-sm text-gray-400">
                                Nenhum item ativo encontrado neste projeto.
                            </p>
                        </div>
                    ) : (
                        <DataTable
                            data={filteredStocks}
                            columns={columns}
                            enableRowSelection
                            onRowSelectionChange={(rows) =>
                                setData(
                                    'stock_ids',
                                    rows.map((row) => row.id),
                                )
                            }
                        />
                    )}

                    {errors.stock_ids && (
                        <p className="mt-2 text-xs text-red-500">
                            {errors.stock_ids}
                        </p>
                    )}
                </div>

                {/*
                |--------------------------------------------------------------
                | Rodapé (espelho do topo — útil em telas longas)
                |--------------------------------------------------------------
                */}

                <div className="flex items-center justify-end gap-3 pb-6 bg-white p-4 m-2 rounded-2xl shadow-sm">
                    <a
                        href={route('admin.inventories.index')}
                        className="rounded-xl border px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Cancelar
                    </a>

                    <button
                        type="submit"
                        disabled={processing || !canSave}
                        className="rounded-xl bg-core-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-core-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Salvando...' : 'Criar Inventário'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}