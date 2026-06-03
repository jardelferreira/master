import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

import type {
    Product,
    ProductSelectCategory,
    ProductSelectUnit,
} from '@/types/product';

type Props = {
    open: boolean;
    onClose: () => void;
    product?: Product | null;
    categories: ProductSelectCategory[];
    units: ProductSelectUnit[];
};

type FormData = {
    id: number;
    name: string;
    sku: string;
    description: string;
    category_id: string;
    unit: string;
    active: boolean;
};

const EMPTY_FORM: FormData = {
    id: 0,
    name: '',
    sku: '',
    description: '',
    category_id: '',
    unit: '',
    active: true,
};

export default function ProductFormModal({
    open,
    onClose,
    product,
    categories,
    units,
}: Props) {
    const isEditing = !!product;

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

    useEffect(() => {
        if (open) {
            if (product) {
                setData({
                    id: product.id,
                    name: product.name ?? '',
                    sku: product.sku ?? '',
                    description: product.description ?? '',
                    category_id: product.category?.id
                        ? String(product.category.id)
                        : '',
                    unit: product.unit?.value ?? '',
                    active: product.active ?? true,
                });
            } else {
                reset();
            }

            clearErrors();
        }
    }, [open, product]);

    function handleClose() {
        reset();
        clearErrors();
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            put(route('admin.products.update', product.id), {
                onSuccess: handleClose,
            });
        } else {
            post(route('admin.products.store'), {
                onSuccess: handleClose,
            });
        }
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="relative w-full max-w-2xl rounded-2xl border border-base-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-base-900">
                            {isEditing
                                ? 'Editar Produto'
                                : 'Novo Produto'}
                        </h2>

                        <p className="text-sm text-base-400 mt-0.5">
                            {isEditing
                                ? 'Atualize os dados do produto.'
                                : 'Preencha os dados para cadastrar um novo produto.'}
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 hover:bg-base-100 text-base-400 hover:text-base-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={submit}
                    className="flex flex-col flex-1 overflow-hidden"
                >
                    <div className="flex-1 px-6 py-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Nome */}
                        <Field
                            label="Nome do Produto"
                            required
                            className="sm:col-span-2"
                            error={errors.name}
                        >
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Ex: Cimento CP-II"
                                className={inputClass(!!errors.name)}
                            />
                        </Field>

                        {/* SKU */}
                        <Field
                            label="SKU"
                            error={errors.sku}
                        >
                            <input
                                type="text"
                                value={data.sku}
                                onChange={(e) =>
                                    setData('sku', e.target.value)
                                }
                                placeholder="Ex: CIM-001"
                                className={inputClass(!!errors.sku)}
                            />
                        </Field>

                        {/* Unidade */}
                        <Field
                            label="Unidade"
                            required
                            error={errors.unit}
                        >
                            <select
                                value={data.unit}
                                onChange={(e) =>
                                    setData('unit', e.target.value)
                                }
                                className={inputClass(!!errors.unit)}
                            >
                                <option value="">
                                    Selecione...
                                </option>

                                {units.map((unit) => (
                                    <option
                                        key={unit.value}
                                        value={unit.value}
                                    >
                                        {unit.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        {/* Categoria */}
                        <Field
                            label="Categoria"
                            required
                            className="sm:col-span-2"
                            error={errors.category_id}
                        >
                            <select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData(
                                        'category_id',
                                        e.target.value,
                                    )
                                }
                                className={inputClass(
                                    !!errors.category_id,
                                )}
                            >
                                <option value="">
                                    Selecione uma categoria
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        {/* Descrição */}
                        <Field
                            label="Descrição"
                            className="sm:col-span-2"
                            error={errors.description}
                        >
                            <textarea
                                rows={5}
                                value={data.description}
                                onChange={(e) =>
                                    setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder="Descrição opcional do produto..."
                                className={inputClass(
                                    !!errors.description,
                                )}
                            />
                        </Field>

                        {/* Status */}
                        <div className="sm:col-span-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData('active', !data.active)
                                }
                                className={`relative flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-core-500 focus:ring-offset-1 ${
                                    data.active
                                        ? 'bg-core-600'
                                        : 'bg-base-300'
                                }`}
                            >
                                <span
                                    className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                        data.active
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>

                            <span className="text-sm font-medium text-base-700">
                                {data.active
                                    ? 'Produto ativo'
                                    : 'Produto inativo'}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-base-100 bg-base-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex items-center justify-center rounded-md border border-base-300 px-4 py-2 text-sm font-medium text-base-700 hover:bg-base-100 transition-colors"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-md bg-core-600 px-5 py-2 text-sm font-medium text-white hover:bg-core-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                        >
                            {processing
                                ? 'Salvando...'
                                : isEditing
                                  ? 'Salvar alterações'
                                  : 'Cadastrar produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* helpers */

function inputClass(hasError: boolean) {
    return `w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-core-500 focus:outline-none transition-colors ${
        hasError ? 'border-red-500 bg-red-50' : 'border-base-300 bg-white'
    }`;
}

type FieldProps = {
    label: string;
    required?: boolean;
    error?: string;
    className?: string;
    children: React.ReactNode;
};

function Field({
    label,
    required,
    error,
    className = '',
    children,
}: FieldProps) {
    return (
        <div className={className}>
            <label className="mb-1 block text-sm font-medium text-base-700">
                {label}
                {required && (
                    <span className="ml-0.5 text-red-500">*</span>
                )}
            </label>

            {children}

            {error && (
                <p className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}