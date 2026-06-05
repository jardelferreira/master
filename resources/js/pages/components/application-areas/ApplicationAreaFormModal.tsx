import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';

import Modal from '@/pages/components/Modal';

import type {
    ApplicationArea,
    ApplicationAreaOption,
} from '@/types/application-area';

type Props = {
    open: boolean;
    onClose: () => void;

    applicationArea?: ApplicationArea | null;

    parentAreas: ApplicationAreaOption[];
};

type FormData = {
    code: string;
    name: string;
    description: string;
    parent_id: number | '';
    sort_order: number;
    active: boolean;
};

const EMPTY_FORM: FormData = {
    code: '',
    name: '',
    description: '',
    parent_id: '',
    sort_order: 0,
    active: true,
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
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

function inputClass(
    hasError: boolean,
) {
    return `
        w-full rounded-lg border px-3 py-2 text-sm
        ${
            hasError
                ? 'border-red-500'
                : 'border-slate-300'
        }
    `;
}

export default function ApplicationAreaFormModal({
    open,
    onClose,
    applicationArea,
    parentAreas,
}: Props) {
    const isEditing =
        !!applicationArea;

    const {
        data,
        setData,
        post,
        put,
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

        if (applicationArea) {
            setData({
                code:
                    applicationArea.code ??
                    '',

                name:
                    applicationArea.name,

                description:
                    applicationArea.description ??
                    '',

                parent_id:
                    applicationArea.parent_id ??
                    '',

                sort_order:
                    applicationArea.sort_order,

                active:
                    applicationArea.active,
            });
        } else {
            reset();
        }

        clearErrors();
    }, [
        open,
        applicationArea,
    ]);

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
                    'admin.settings.application-areas.update',
                    applicationArea.id,
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
                'admin.settings.application-areas.store',
            ),
            {
                preserveScroll: true,
                onSuccess:
                    handleClose,
            },
        );
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title={
                isEditing
                    ? 'Editar Área'
                    : 'Nova Área'
            }
            size="lg"
        >
            <form
                onSubmit={submit}
                className="space-y-4"
            >
                <Field
                    label="Código"
                    error={errors.code}
                >
                    <input
                        value={data.code}
                        onChange={(e) =>
                            setData(
                                'code',
                                e.target.value,
                            )
                        }
                        className={inputClass(
                            !!errors.code,
                        )}
                    />
                </Field>

                <Field
                    label="Nome"
                    required
                    error={errors.name}
                >
                    <input
                        value={data.name}
                        onChange={(e) =>
                            setData(
                                'name',
                                e.target.value,
                            )
                        }
                        className={inputClass(
                            !!errors.name,
                        )}
                    />
                </Field>

                <Field
                    label="Descrição"
                    error={
                        errors.description
                    }
                >
                    <textarea
                        rows={4}
                        value={
                            data.description
                        }
                        onChange={(e) =>
                            setData(
                                'description',
                                e.target.value,
                            )
                        }
                        className={inputClass(
                            !!errors.description,
                        )}
                    />
                </Field>

                <Field
                    label="Área Pai"
                    error={
                        errors.parent_id
                    }
                >
                    <select
                        value={
                            data.parent_id
                        }
                        onChange={(e) =>
                            setData(
                                'parent_id',
                                e.target.value
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

                        {parentAreas
                            .filter(
                                (
                                    area,
                                ) =>
                                    area.id !==
                                    applicationArea?.id,
                            )
                            .map(
                                (
                                    area,
                                ) => (
                                    <option
                                        key={
                                            area.id
                                        }
                                        value={
                                            area.id
                                        }
                                    >
                                        {
                                            area.name
                                        }
                                    </option>
                                ),
                            )}
                    </select>
                </Field>

                <Field
                    label="Ordem"
                    error={
                        errors.sort_order
                    }
                >
                    <input
                        type="number"
                        value={
                            data.sort_order
                        }
                        onChange={(e) =>
                            setData(
                                'sort_order',
                                Number(
                                    e.target
                                        .value,
                                ),
                            )
                        }
                        className={inputClass(
                            !!errors.sort_order,
                        )}
                    />
                </Field>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={
                            data.active
                        }
                        onChange={(e) =>
                            setData(
                                'active',
                                e.target
                                    .checked,
                            )
                        }
                    />

                    Ativa
                </label>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        className="rounded-lg border px-4 py-2"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={
                            processing
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                        {processing
                            ? 'Salvando...'
                            : isEditing
                              ? 'Salvar'
                              : 'Cadastrar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}