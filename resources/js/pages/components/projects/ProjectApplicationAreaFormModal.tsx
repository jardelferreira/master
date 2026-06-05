import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

type TeamOption = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;

    projectId: number;

    availableAreas: TeamOption[];
};

type FormData = {
    application_area_id: number | '';
};

const EMPTY_FORM: FormData = {
    application_area_id: '',
};

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
    return `w-full rounded-md border px-3 py-2 text-sm text-base-900 transition focus:border-core-600 focus:outline-none focus:ring-1 focus:ring-core-600 ${
        hasError
            ? 'border-red-500 bg-red-50'
            : 'border-base-300 bg-white'
    }`;
}

export default function ProjectTeamFormModal({
    open,
    onClose,
    projectId,
    availableAreas,
}: Props) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<FormData>(
        EMPTY_FORM,
    );

    useEffect(() => {
        if (!open) {
            return;
        }

        reset();

        clearErrors();
    }, [open]);

    function handleClose() {
        reset();

        clearErrors();

        onClose();
    }

    function submit(
        e: React.FormEvent,
    ) {
        e.preventDefault();

        post(
            route(
                'admin.projects.application-areas.store',
                projectId,
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
            <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-base-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-base-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-base-900">
                            Vincular Equipe
                        </h2>

                        <p className="mt-0.5 text-sm text-base-400">
                            Selecione uma equipe
                            para associar ao
                            projeto.
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
                    className="flex flex-col"
                >
                    <div className="space-y-4 px-6 py-5">
                        <Field
                            label="Equipe"
                            required
                            error={
                                errors.application_area_id
                            }
                        >
                            <select
                                value={
                                    data.application_area_id
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setData(
                                        'application_area_id',
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
                                    !!errors.application_area_id,
                                )}
                            >
                                <option value="">
                                    Selecione
                                    uma
                                    equipe
                                </option>

                                {availableAreas.map(
                                    (
                                        team,
                                    ) => (
                                        <option
                                            key={
                                                team.id
                                            }
                                            value={
                                                team.id
                                            }
                                        >
                                            {
                                                team.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </Field>
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
                                : 'Vincular equipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}