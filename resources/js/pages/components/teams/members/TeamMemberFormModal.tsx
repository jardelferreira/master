import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

import {
    TeamMember,
    TeamMemberEmployeeOption,
} from '@/types/team-member';

type RoleOption = {
    value: string;
    label: string;
};

type Props = {
    open: boolean;
    onClose: () => void;

    teamId: number;

    member?: TeamMember | null;

    employees: TeamMemberEmployeeOption[];

    roles: RoleOption[];
};

type FormData = {
    employee_id: number | '';

    role: string;

    is_primary: boolean;

    active: boolean;
};

const EMPTY_FORM: FormData = {
    employee_id: '',

    role: 'member',

    is_primary: false,

    active: true,
};

export default function TeamMemberFormModal({
    open,
    onClose,
    teamId,
    member,
    employees,
    roles,
}: Props) {
    const isEditing = !!member;

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

        if (member) {
            setData({
                employee_id: member.id,

                role: member.role,

                is_primary:
                    member.is_primary,

                active:
                    member.active,
            });
        } else {
            reset();
        }

        clearErrors();
    }, [open, member]);

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
                    'admin.settings.teams.members.update',
                    [
                        teamId,
                        member!.id,
                    ],
                ),
                {
                    preserveScroll: true,

                    onSuccess:
                        handleClose,
                },
            );

            return;
        }

        post(
            route(
                'admin.settings.teams.members.store',
                teamId,
            ),
            {
                preserveScroll: true,

                onSuccess:
                    handleClose,
            },
        );
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
            <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-base-200 bg-white shadow-2xl">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-base-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {isEditing
                                ? 'Editar Membro'
                                : 'Adicionar Membro'}
                        </h2>

                        <p className="text-sm text-base-500">
                            {isEditing
                                ? 'Atualize os dados do vínculo.'
                                : 'Adicione um colaborador à equipe.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        className="rounded-lg p-2 hover:bg-base-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}

                <form
                    onSubmit={submit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="space-y-4 overflow-y-auto px-6 py-5">
                        {/* Colaborador */}

                        <Field
                            label="Colaborador"
                            required
                            error={
                                errors.employee_id
                            }
                        >
                            {isEditing ? (
                                <input
                                    disabled
                                    value={
                                        member?.name ??
                                        ''
                                    }
                                    className={inputClass(
                                        false,
                                    )}
                                />
                            ) : (
                                <select
                                    value={
                                        data.employee_id
                                    }
                                    onChange={(
                                        e,
                                    ) =>
                                        setData(
                                            'employee_id',
                                            Number(
                                                e
                                                    .target
                                                    .value,
                                            ),
                                        )
                                    }
                                    className={inputClass(
                                        !!errors.employee_id,
                                    )}
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {(employees ?? []).map(
                                        (
                                            employee,
                                        ) => (
                                            <option
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.id
                                                }
                                            >
                                                {
                                                    employee.label
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            )}
                        </Field>

                        {/* Papel */}

                        <Field
                            label="Papel"
                            required
                            error={
                                errors.role
                            }
                        >
                            <select
                                value={
                                    data.role
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'role',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                className={inputClass(
                                    !!errors.role,
                                )}
                            >
                                {(roles ?? []).map(
                                    (
                                        role,
                                    ) => (
                                        <option
                                            key={
                                                role.value
                                            }
                                            value={
                                                role.value
                                            }
                                        >
                                            {
                                                role.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </Field>

                        {/* Principal */}

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    data.is_primary
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'is_primary',
                                        e
                                            .target
                                            .checked,
                                    )
                                }
                            />

                            <span className="text-sm">
                                Equipe
                                principal
                            </span>
                        </div>

                        {/* Ativo */}

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    data.active
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'active',
                                        e
                                            .target
                                            .checked,
                                    )
                                }
                            />

                            <span className="text-sm">
                                Vínculo ativo
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
                            className="rounded-md border border-base-300 px-4 py-2 text-sm"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={
                                processing
                            }
                            className="rounded-md bg-core-600 px-5 py-2 text-sm font-medium text-white"
                        >
                            {processing
                                ? 'Salvando...'
                                : isEditing
                                  ? 'Salvar alterações'
                                  : 'Adicionar membro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

type FieldProps = {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
};

function Field({
    label,
    required,
    error,
    children,
}: FieldProps) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
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

function inputClass(
    hasError: boolean,
) {
    return `w-full rounded-md border px-3 py-2 text-sm ${
        hasError
            ? 'border-red-500'
            : 'border-base-300'
    }`;
}