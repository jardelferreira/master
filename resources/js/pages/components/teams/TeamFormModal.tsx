import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

import type {
    Team,
    TeamOption,
} from '@/types/team';

type Props = {
    open: boolean;
    onClose: () => void;

    team?: Team | null;

    parentTeams: TeamOption[];
};

type FormData = {
    id: number;

    parent_id: number | '';

    code: string;

    name: string;

    description: string;

    sort_order: number;

    active: boolean;
};

const EMPTY_FORM: FormData = {
    id: 0,

    parent_id: '',

    code: '',

    name: '',

    description: '',

    sort_order: 0,

    active: true,
};

function Field({
    label,
    required,
    error,
    className,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={className}>
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

function inputClass(hasError: boolean) {
    return `w-full rounded-md border px-3 py-2 text-sm text-base-900 transition focus:border-core-600 focus:outline-none focus:ring-1 focus:ring-core-600 ${
        hasError ? 'border-red-500 bg-red-50' : 'border-base-300 bg-white'
    }`;
}

export default function TeamFormModal({
    open,
    onClose,
    team,
    parentTeams,
}: Props) {
    const isEditing = !!team;

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

        if (team) {
            setData({
                id: team.id,

                parent_id:
                    team.parent_id ?? '',

                code:
                    team.code ?? '',

                name:
                    team.name ?? '',

                description:
                    team.description ??
                    '',

                sort_order:
                    team.sort_order ??
                    0,

                active:
                    team.active ??
                    true,
            });
        } else {
            reset();
        }

        clearErrors();
    }, [open, team]);

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
                    'admin.settings.teams.update',
                    team!.id,
                ),
                {
                    onSuccess:
                        handleClose,
                },
            );
        } else {
            post(
                route(
                    'admin.settings.teams.store',
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
                <div className="flex items-center justify-between border-b border-base-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-base-900">
                            {isEditing
                                ? 'Editar Equipe'
                                : 'Nova Equipe'}
                        </h2>

                        <p className="mt-0.5 text-sm text-base-400">
                            {isEditing
                                ? 'Atualize os dados da equipe.'
                                : 'Preencha os dados para cadastrar uma nova equipe.'}
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
                                className={inputClass(
                                    !!errors.name,
                                )}
                            />
                        </Field>

                        <Field
                            label="Código"
                            error={
                                errors.code
                            }
                        >
                            <input
                                type="text"
                                value={
                                    data.code
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'code',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                className={inputClass(
                                    !!errors.code,
                                )}
                            />
                        </Field>

                        <Field
                            label="Equipe Pai"
                            className="sm:col-span-2"
                            error={
                                errors.parent_id
                            }
                        >
                            <select
                                value={
                                    data.parent_id
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'parent_id',
                                        e
                                            .target
                                            .value
                                            ? Number(
                                                  e
                                                      .target
                                                      .value,
                                              )
                                            : '',
                                    )
                                }
                                className={inputClass(
                                    !!errors.parent_id,
                                )}
                            >
                                <option value="">
                                    Nenhuma
                                </option>

                                {parentTeams
                                    .filter(
                                        (
                                            item,
                                        ) =>
                                            item.id !==
                                            team?.id,
                                    )
                                    .map(
                                        (
                                            item,
                                        ) => (
                                            <option
                                                key={
                                                    item.id
                                                }
                                                value={
                                                    item.id
                                                }
                                            >
                                                {
                                                    item.name
                                                }
                                            </option>
                                        ),
                                    )}
                            </select>
                        </Field>

                        <Field
                            label="Descrição"
                            className="sm:col-span-2"
                            error={
                                errors.description
                            }
                        >
                            <textarea
                                rows={
                                    4
                                }
                                value={
                                    data.description
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'description',
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                className={inputClass(
                                    !!errors.description,
                                )}
                            />
                        </Field>

                        <Field
                            label="Ordem"
                            error={
                                errors.sort_order
                            }
                        >
                            <input
                                type="number"
                                min={0}
                                value={
                                    data.sort_order
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'sort_order',
                                        Number(
                                            e
                                                .target
                                                .value,
                                        ),
                                    )
                                }
                                className={inputClass(
                                    !!errors.sort_order,
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
                                    ? 'Equipe ativa'
                                    : 'Equipe inativa'}
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
                            className="inline-flex items-center justify-center rounded-md bg-core-600 px-5 py-2 text-sm font-medium text-white hover:bg-core-700 disabled:opacity-60"
                        >
                            {processing
                                ? 'Salvando...'
                                : isEditing
                                  ? 'Salvar alterações'
                                  : 'Cadastrar equipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}