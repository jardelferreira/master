import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { ProductStockMinimal } from '@/types/product';

type Project = {
    id: number;
    name: string;
};

type Sector = {
    id: number;
    name: string;
    project_id: number;
};

type ScopeType = 'global' | 'project' | 'sector';

type Props = {
    open: boolean;
    onClose: () => void;
    productId: number;
    stockMinimal?: ProductStockMinimal | null;
    projects: Project[];
    sectors: Sector[];
};

type FormData = {
    product_id: number;
    project_id: string;
    sector_id: string;
    min_quantity: string;
};

const EMPTY_FORM: FormData = {
    product_id: 0,
    project_id: '',
    sector_id: '',
    min_quantity: '',
};

export default function StockMinimalFormModal({
    open,
    onClose,
    productId,
    stockMinimal,
    projects,
    sectors,
}: Props) {
    const isEditing = !!stockMinimal;

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<FormData>(EMPTY_FORM);

    const [scope, setScope] =
        useState<ScopeType>('global');

    useEffect(() => {
        if (!open) return;

        if (stockMinimal) {
            setScope(stockMinimal.scope);
            setData({
                product_id: productId,
                project_id: stockMinimal.project?.id
                    ? String(stockMinimal.project.id)
                    : '',
                sector_id: stockMinimal.sector?.id
                    ? String(stockMinimal.sector.id)
                    : '',
                min_quantity: String(stockMinimal.min_quantity),
            });
        } else {
            reset();
            setScope('global');
            setData('product_id', productId);
        }

        clearErrors();
    }, [open, stockMinimal]);

    function handleClose() {
        reset();
        clearErrors();
        onClose();
    }

    function handleScopeChange(newScope: ScopeType) {
        setScope(newScope);

        if (newScope === 'global') {
            setData((prev) => ({
                ...prev,
                project_id: '',
                sector_id: '',
            }));
        }

        if (newScope === 'project') {
            setData((prev) => ({
                ...prev,
                sector_id: '',
            }));
        }

        if (newScope === 'sector') {
            setData((prev) => ({
                ...prev,
                sector_id: '',
            }));
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            put(
                route(
                    'admin.stock-minimals.update',
                    stockMinimal.id,
                ),
                {
                    onSuccess: handleClose,
                },
            );
        } else {
            post(route('admin.stock-minimals.store'), {
                onSuccess: handleClose,
            });
        }
    }

    const filteredSectors = sectors.filter(
        (sector) =>
            !data.project_id ||
            sector.project_id === Number(data.project_id),
    );

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) =>
                e.target === e.currentTarget && handleClose()
            }
        >
            <div className="relative w-full max-w-xl rounded-2xl border border-base-200 bg-white shadow-2xl flex flex-col">
                {/* header */}
                <div className="flex items-center justify-between border-b border-base-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-base-900">
                            {isEditing
                                ? 'Editar estoque mínimo'
                                : 'Novo estoque mínimo'}
                        </h2>
                    </div>

                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 hover:bg-base-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form
                    onSubmit={submit}
                    className="flex flex-col"
                >
                    <div className="px-6 py-5 space-y-4">
                        {/* escopo */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Escopo
                            </label>

                            <div className="flex gap-2">
                                {[
                                    {
                                        key: 'global',
                                        label: 'Global',
                                    },
                                    {
                                        key: 'project',
                                        label: 'Projeto',
                                    },
                                    {
                                        key: 'sector',
                                        label: 'Setor',
                                    },
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() =>
                                            handleScopeChange(
                                                item.key as ScopeType,
                                            )
                                        }
                                        className={`px-4 py-2 rounded-lg border text-sm ${scope === item.key
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'border-base-300'
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* projeto */}
                        {scope !== 'global' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Projeto
                                </label>

                                <select
                                    value={data.project_id}
                                    onChange={(e) =>
                                        setData(
                                            'project_id',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-md border px-3 py-2"
                                >
                                    <option value="">
                                        Selecione...
                                    </option>

                                    {projects.map((project) => (
                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* setor */}
                        {scope === 'sector' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Setor
                                </label>

                                <select
                                    value={data.sector_id}
                                    onChange={(e) =>
                                        setData(
                                            'sector_id',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-md border px-3 py-2"
                                >
                                    <option value="">
                                        Selecione...
                                    </option>

                                    {filteredSectors.map(
                                        (sector) => (
                                            <option
                                                key={sector.id}
                                                value={sector.id}
                                            >
                                                {sector.name}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        )}

                        {/* quantidade */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Quantidade mínima
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.min_quantity}
                                onChange={(e) =>
                                    setData(
                                        'min_quantity',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-md border px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="border px-4 py-2 rounded-md"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-core-600 text-white px-5 py-2 rounded-md"
                        >
                            {processing
                                ? 'Salvando...'
                                : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}