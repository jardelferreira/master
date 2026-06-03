import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Category } from '@/types/category';

type ParentCategory = {
    id: number;
    name: string;
    parent_id?: number | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    category?: Category | null;
    parents: ParentCategory[];
};

type FormData = {
    id: number;
    name: string;
    description: string;
    parent_id: string;
    active: boolean;
};

const EMPTY_FORM: FormData = {
    id: 0,
    name: '',
    description: '',
    parent_id: '',
    active: true,
};

export default function CategoryFormModal({
    open,
    onClose,
    category,
    parents,
}: Props) {
    const isEditing = !!category;

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
            if (category) {
                setData({
                    id: category.id,
                    name: category.name ?? '',
                    description: category.description ?? '',
                    parent_id: category.parent?.id
                        ? String(category.parent.id)
                        : '',
                    active: category.active ?? true,
                });
            } else {
                reset();
            }

            clearErrors();
        }
    }, [open, category]);

    function handleClose() {
        reset();
        clearErrors();
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            put(route('admin.categories.update', category.id), {
                onSuccess: handleClose,
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: handleClose,
            });
        }
    }

    const availableParents = parents.filter(
        (parent) => !category || parent.id !== category.id,
    );

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
                            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
                        </h2>

                        <p className="text-sm text-base-400 mt-0.5">
                            {isEditing
                                ? 'Atualize os dados da categoria.'
                                : 'Preencha os dados para cadastrar uma nova categoria.'}
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
                    <div className="flex-1 overflow-y-auto px-6 py-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Nome */}
                        <Field
                            label="Nome da Categoria"
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
                                placeholder="Ex: Materiais Elétricos"
                                className={inputClass(!!errors.name)}
                            />
                        </Field>

                        {/* Categoria pai */}
                        <Field
                            label="Categoria Pai"
                            className="sm:col-span-2"
                            error={errors.parent_id}
                        >
                            <select
                                value={data.parent_id}
                                onChange={(e) =>
                                    setData('parent_id', e.target.value)
                                }
                                className={inputClass(!!errors.parent_id)}
                            >
                                <option value="">
                                    Sem categoria pai (raiz)
                                </option>

                                {availableParents.map((parent) => (
                                    <option
                                        key={parent.id}
                                        value={parent.id}
                                    >
                                        {parent.name}
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
                                    setData('description', e.target.value)
                                }
                                placeholder="Descrição opcional da categoria..."
                                className={inputClass(!!errors.description)}
                            />
                        </Field>

                        {/* Status */}
                        <div className="sm:col-span-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData('active', !data.active)
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-core-500 focus:ring-offset-1 ${
                                    data.active
                                        ? 'bg-core-600'
                                        : 'bg-base-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                        data.active
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>

                            <span className="text-sm font-medium text-base-700">
                                {data.active
                                    ? 'Categoria ativa'
                                    : 'Categoria inativa'}
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
                                  : 'Cadastrar categoria'}
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