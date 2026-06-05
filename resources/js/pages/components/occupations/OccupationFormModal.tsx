import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export type Occupation = {
    id: number;
    name: string;
    description: string | null;
    active: boolean;
};

type Props = {
    open: boolean;
    onClose: () => void;
    occupation?: Occupation | null;
};

type FormData = {
    name: string;
    description: string;
    active: boolean;
};

const EMPTY_FORM: FormData = {
    name: '',
    description: '',
    active: true,
};

export default function OccupationFormModal({
    open,
    onClose,
    occupation,
}: Props) {
    const isEditing = !!occupation;

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
            if (occupation) {
                setData({
                    name: occupation.name ?? '',
                    description: occupation.description ?? '',
                    active: occupation.active ?? true,
                });
            } else {
                reset();
            }

            clearErrors();
        }
    }, [open, occupation]);

    function handleClose() {
        reset();
        clearErrors();
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            put(
                route(
                    'admin.settings.occupations.update',
                    occupation.id,
                ),
                {
                    onSuccess: handleClose,
                },
            );
        } else {
            post(
                route('admin.settings.occupations.store'),
                {
                    onSuccess: handleClose,
                },
            );
        }
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) =>
                e.target === e.currentTarget &&
                handleClose()
            }
        >
            <div className="relative w-full max-w-xl rounded-2xl border border-base-200 bg-white shadow-2xl flex flex-col">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-base-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-base-900">
                            {isEditing
                                ? 'Editar Ocupação'
                                : 'Nova Ocupação'}
                        </h2>

                        <p className="text-sm text-base-400 mt-0.5">
                            {isEditing
                                ? 'Atualize os dados da ocupação.'
                                : 'Preencha os dados para cadastrar uma nova ocupação.'}
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 hover:bg-base-100 text-base-400 hover:text-base-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}

                <form onSubmit={submit}>
                    <div className="p-6 space-y-4">

                        <Field
                            label="Nome"
                            required
                            error={errors.name}
                        >
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Ex.: Pedreiro"
                                className={inputClass(
                                    !!errors.name,
                                )}
                            />
                        </Field>

                        <Field
                            label="Descrição"
                            error={errors.description}
                        >
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) =>
                                    setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder="Descrição opcional..."
                                className={inputClass(
                                    !!errors.description,
                                )}
                            />
                        </Field>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        'active',
                                        !data.active,
                                    )
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
                                    ? 'Ocupação ativa'
                                    : 'Ocupação inativa'}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}

                    <div className="flex items-center justify-end gap-3 border-t border-base-100 bg-base-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex items-center justify-center rounded-md border border-base-300 px-4 py-2 text-sm font-medium text-base-700 hover:bg-base-100"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-md bg-core-600 px-5 py-2 text-sm font-medium text-white hover:bg-core-700 disabled:opacity-60"
                        >
                            {processing
                                ? 'Salvando...'
                                : isEditing
                                  ? 'Salvar alterações'
                                  : 'Cadastrar ocupação'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function inputClass(hasError: boolean) {
    return `w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-core-500 focus:outline-none transition-colors ${
        hasError
            ? 'border-red-500 bg-red-50'
            : 'border-base-300 bg-white'
    }`;
}

function Field({
    label,
    required,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-base-700">
                {label}
                {required && (
                    <span className="ml-1 text-red-500">*</span>
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