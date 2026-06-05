import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

import type { Company } from '@/types/company';

type Props = {
    open: boolean;
    onClose: () => void;
    company?: Company | null;
};

type FormData = {
    id: number;

    name: string;
    trade_name: string;

    document: string;

    email: string;
    phone: string;

    type: 'own' | 'third_party';

    active: boolean;
};

const EMPTY_FORM: FormData = {
    id: 0,

    name: '',
    trade_name: '',

    document: '',

    email: '',
    phone: '',

    type: 'third_party',

    active: true,
};

export default function CompanyFormModal({
    open,
    onClose,
    company,
}: Props) {
    const isEditing = !!company;

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
        if (!open) {
            return;
        }

        if (company) {
            setData({
                id: company.id,

                name: company.name ?? '',
                trade_name:
                    company.trade_name ?? '',

                document:
                    company.document ?? '',

                email: company.email ?? '',
                phone: company.phone ?? '',

                type:
                    company.type ??
                    'third_party',

                active:
                    company.active ?? true,
            });
        } else {
            reset();
        }

        clearErrors();
    }, [open, company]);

    function handleClose() {
        reset();
        clearErrors();
        onClose();
    }

    function submit(
        e: React.FormEvent,
    ) {
        e.preventDefault();

        if (isEditing) {
            put(
                route(
                    'admin.settings.companies.update',
                    company.id,
                ),
                {
                    onSuccess:
                        handleClose,
                },
            );
        } else {
            post(
                route(
                    'admin.settings.companies.store',
                ),
                {
                    onSuccess:
                        handleClose,
                },
            );
        }
    }

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={(e) =>
                e.target ===
                    e.currentTarget &&
                handleClose()
            }
        >
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-base-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-base-900">
                            {isEditing
                                ? 'Editar Empresa'
                                : 'Nova Empresa'}
                        </h2>

                        <p className="mt-0.5 text-sm text-base-400">
                            {isEditing
                                ? 'Atualize os dados da empresa.'
                                : 'Preencha os dados para cadastrar uma nova empresa.'}
                        </p>
                    </div>

                    <button
                        onClick={
                            handleClose
                        }
                        className="rounded-lg p-2 text-base-400 transition-colors hover:bg-base-100 hover:text-base-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={submit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
                        <Field
                            label="Razão Social"
                            required
                            className="sm:col-span-2"
                            error={
                                errors.name
                            }
                        >
                            <input
                                type="text"
                                value={
                                    data.name
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'name',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Ex: Construtora XYZ LTDA"
                                className={inputClass(
                                    !!errors.name,
                                )}
                            />
                        </Field>

                        <Field
                            label="Nome Fantasia"
                            className="sm:col-span-2"
                            error={
                                errors.trade_name
                            }
                        >
                            <input
                                type="text"
                                value={
                                    data.trade_name
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'trade_name',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Ex: XYZ Construções"
                                className={inputClass(
                                    !!errors.trade_name,
                                )}
                            />
                        </Field>

                        <Field
                            label="Tipo"
                            required
                            className="sm:col-span-2"
                            error={
                                errors.type
                            }
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'type',
                                            'own',
                                        )
                                    }
                                    className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                                        data.type ===
                                        'own'
                                            ? 'border-core-600 bg-core-50 text-core-700'
                                            : 'border-base-300'
                                    }`}
                                >
                                    Própria
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'type',
                                            'third_party',
                                        )
                                    }
                                    className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                                        data.type ===
                                        'third_party'
                                            ? 'border-core-600 bg-core-50 text-core-700'
                                            : 'border-base-300'
                                    }`}
                                >
                                    Terceira
                                </button>
                            </div>
                        </Field>

                        <Field
                            label="CNPJ"
                            error={
                                errors.document
                            }
                        >
                            <input
                                type="text"
                                value={
                                    data.document
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'document',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="00.000.000/0001-00"
                                className={inputClass(
                                    !!errors.document,
                                )}
                            />
                        </Field>

                        <Field
                            label="Telefone"
                            error={
                                errors.phone
                            }
                        >
                            <input
                                type="text"
                                value={
                                    data.phone
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'phone',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="(81) 99999-9999"
                                className={inputClass(
                                    !!errors.phone,
                                )}
                            />
                        </Field>

                        <Field
                            label="E-mail"
                            className="sm:col-span-2"
                            error={
                                errors.email
                            }
                        >
                            <input
                                type="email"
                                value={
                                    data.email
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'email',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="contato@empresa.com.br"
                                className={inputClass(
                                    !!errors.email,
                                )}
                            />
                        </Field>

                        <div className="sm:col-span-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        'active',
                                        !data.active,
                                    )
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
                                    ? 'Empresa ativa'
                                    : 'Empresa inativa'}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-base-100 bg-base-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            className="inline-flex items-center justify-center rounded-md border border-base-300 px-4 py-2 text-sm font-medium text-base-700 transition-colors hover:bg-base-100"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={
                                processing
                            }
                            className="inline-flex items-center justify-center rounded-md bg-core-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-core-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing
                                ? 'Salvando...'
                                : isEditing
                                  ? 'Salvar alterações'
                                  : 'Cadastrar empresa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function inputClass(
    hasError: boolean,
) {
    return `w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-core-500 transition-colors ${
        hasError
            ? 'border-red-500 bg-red-50'
            : 'border-base-300 bg-white'
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
                    <span className="ml-0.5 text-red-500">
                        *
                    </span>
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