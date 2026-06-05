import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

import type { Employee } from '@/types/employee';
import type { SelectOption } from '@/types/select-option';

type Props = {
    open: boolean;
    onClose: () => void;

    employee?: Employee | null;

    companies: SelectOption[];
    occupations: SelectOption[];
};

type FormData = {
    id: number;

    name: string;

    email: string;
    phone: string;
    cpf: string;

    company_id: number | '';
    occupation_id: number | '';

    active: boolean;
};

const EMPTY_FORM: FormData = {
    id: 0,

    name: '',

    email: '',
    phone: '',
    cpf: '',

    company_id: '',
    occupation_id: '',

    active: true,
};

export default function EmployeeFormModal({
    open,
    onClose,
    employee,
    companies,
    occupations,
}: Props) {
    const isEditing = !!employee;

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

        if (employee) {
            setData({
                id: employee.id,

                name: employee.name ?? '',

                email: employee.email ?? '',
                phone: employee.phone ?? '',
                cpf: employee.cpf ?? '',

                company_id:
                    employee.company_id ?? '',

                occupation_id:
                    employee.occupation_id ?? '',

                active:
                    employee.active ?? true,
            });
        } else {
            reset();
        }

        clearErrors();
    }, [open, employee]);

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
                    'admin.settings.employees.update',
                    employee.id,
                ),
                {
                    onSuccess:
                        handleClose,
                },
            );
        } else {
            post(
                route(
                    'admin.settings.employees.store',
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
                                ? 'Editar Colaborador'
                                : 'Novo Colaborador'}
                        </h2>

                        <p className="mt-0.5 text-sm text-base-400">
                            {isEditing
                                ? 'Atualize os dados do colaborador.'
                                : 'Preencha os dados para cadastrar um novo colaborador.'}
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

                <form
                    onSubmit={submit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
                        <Field
                            label="Nome"
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
                                placeholder="Nome do colaborador"
                                className={inputClass(
                                    !!errors.name,
                                )}
                            />
                        </Field>

                        <Field
                            label="Empresa"
                            required
                            error={
                                errors.company_id
                            }
                        >
                            <select
                                value={
                                    data.company_id
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'company_id',
                                        Number(
                                            e
                                                .target
                                                .value,
                                        ),
                                    )
                                }
                                className={inputClass(
                                    !!errors.company_id,
                                )}
                            >
                                <option value="">
                                    Selecione
                                </option>

                                {companies.map(
                                    (
                                        company,
                                    ) => (
                                        <option
                                            key={
                                                company.id
                                            }
                                            value={
                                                company.id
                                            }
                                        >
                                            {
                                                company.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </Field>

                        <Field
                            label="Ocupação"
                            required
                            error={
                                errors.occupation_id
                            }
                        >
                            <select
                                value={
                                    data.occupation_id
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'occupation_id',
                                        Number(
                                            e
                                                .target
                                                .value,
                                        ),
                                    )
                                }
                                className={inputClass(
                                    !!errors.occupation_id,
                                )}
                            >
                                <option value="">
                                    Selecione
                                </option>

                                {occupations.map(
                                    (
                                        occupation,
                                    ) => (
                                        <option
                                            key={
                                                occupation.id
                                            }
                                            value={
                                                occupation.id
                                            }
                                        >
                                            {
                                                occupation.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </Field>

                        <Field
                            label="CPF"
                            error={
                                errors.cpf
                            }
                        >
                            <input
                                type="text"
                                value={
                                    data.cpf
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'cpf',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="000.000.000-00"
                                className={inputClass(
                                    !!errors.cpf,
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
                                placeholder="colaborador@email.com"
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
                                    ? 'Colaborador ativo'
                                    : 'Colaborador inativo'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-base-100 bg-base-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            className="inline-flex items-center justify-center rounded-md border border-base-300 px-4 py-2 text-sm font-medium text-base-700 hover:bg-base-100"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={
                                processing
                            }
                            className="inline-flex items-center justify-center rounded-md bg-core-600 px-5 py-2 text-sm font-medium text-white hover:bg-core-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing
                                ? 'Salvando...'
                                : isEditing
                                  ? 'Salvar alterações'
                                  : 'Cadastrar colaborador'}
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