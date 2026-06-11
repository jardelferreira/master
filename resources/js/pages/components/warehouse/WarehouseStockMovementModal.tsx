import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { X, Loader2, ChevronDown, Check } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export type WarehouseMovementType =
    | 'consumption'
    | 'transfer'
    | 'assignment'
    | 'adjust'
    | 'return'
    | 'loss';

export type ProjectUser = {
    id: number;
    name: string;
    email: string;
};

type ReturnableMovement = {
    id: number;
    label: string;
    type: string;

    product: string;
    employee: string | null;
    team: string | null;

    quantity: number;
    available_quantity: number;

    stock_id: number;
    employee_id: number | null;
    team_id: number | null;
};

type Stock = {
    id: number;
    project_id: number;
    product: {
        id: number;
        name: string;
        unit?: string | null;
    };
    stock_quantity: number;
};

type TransferOption = {
    id: number;
    project: { id: number; name: string };
    sector?: { id: number; name: string } | null;
    stock_quantity: number;
};

type SelectOption = {
    value: number;
    label: string;
    sublabel?: string;
};

type EmployeeOption = {
    id: number;
    name: string;
};

type TeamOption = {
    id: number;
    name: string;

    employees: {
        id: number;
        name: string;
    }[];
};

type ApplicationAreaOption = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    movementType: WarehouseMovementType | null;
    projectId: number;
    stock: Stock | null;
    stocks: Stock[];
    projectUsers: ProjectUser[];
    loadingUsers: boolean;
    employees: EmployeeOption[];
    teams: TeamOption[];
    applicationAreas: ApplicationAreaOption[];
    lockedMovementId?: number | null;
};

type FormData = {
    type: WarehouseMovementType;

    stock_id: number | '';

    quantity: string;

    new_quantity: string;

    destination_sector_id: number | '';

    destination_user_id: number | '';

    employee_id: number | '';

    movement_id: number | '';

    team_id: number | '';

    application_area_id: number | '';

    notes: string;
};

const TITLES: Record<WarehouseMovementType, string> = {
    consumption: 'Consumir estoque',
    transfer: 'Transferir entre projetos',
    assignment: 'Atribuir item',
    adjust: 'Ajustar estoque',
    return: 'Devolver ao estoque',
    loss: 'Registrar perda',
};

/*
|--------------------------------------------------------------------------
| CustomSelect — dropdown via portal, imune a overflow/z-index do layout
|--------------------------------------------------------------------------
*/
function CustomSelect({
    options,
    value,
    onChange,
    placeholder = 'Selecione...',
    loading = false,
    loadingText = 'Carregando...',
    disabled = false,
}: {
    options: SelectOption[];
    value: number | '';
    onChange: (val: number) => void;
    placeholder?: string;
    loading?: boolean;
    loadingText?: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value) ?? null;

    const computePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropHeight = Math.min(options.length * 56 + 8, 280);

        const showAbove = spaceBelow < dropHeight && spaceAbove > spaceBelow;

        setDropdownStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            zIndex: 99999,
            ...(showAbove
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        });
    }, [options.length]);

    useEffect(() => {
        if (!open) return;
        computePosition();

        const onScroll = () => computePosition();
        const onResize = () => computePosition();
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onResize);
        };
    }, [open, computePosition]);



    // Fecha ao clicar fora
    useEffect(() => {
        if (!open) return;
        function handleClickOutside(e: MouseEvent) {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);



    if (loading) {
        return (
            <div className={`flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm 
            ${disabled
                    ? 'cursor-not-allowed bg-slate-100 '
                    : ''
                }`}>
                <Loader2 size={16} className="animate-spin" />
                {loadingText}
            </div>
        );
    }

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 hover:border-slate-300"
            >
                <span className={selected ? '' : ''}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={` transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={dropdownStyle}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                    >
                        <div className="max-h-[280px] overflow-y-auto py-1">
                            {options.length === 0 ? (
                                <div className="px-4 py-3 text-sm ">
                                    Nenhuma opção disponível
                                </div>
                            ) : (
                                options.map((opt) => {
                                    const isSelected = opt.value === value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value);
                                                setOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <span>
                                                <span
                                                    className={`block font-medium ${isSelected
                                                        ? 'text-blue-700'
                                                        : ''
                                                        }`}
                                                >
                                                    {opt.label}
                                                </span>
                                                {opt.sublabel && (
                                                    <span className="block text-xs ">
                                                        {opt.sublabel}
                                                    </span>
                                                )}
                                            </span>
                                            {isSelected && (
                                                <Check
                                                    size={15}
                                                    className="shrink-0 text-blue-600"
                                                />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Modal principal
|--------------------------------------------------------------------------
*/
export default function WarehouseStockMovementModal({
    open,
    onClose,
    movementType,
    projectId,
    stock,
    stocks,
    projectUsers,
    loadingUsers,
    employees,
    teams,
    applicationAreas,
    lockedMovementId = null,
}: Props) {
    const [transferOptions, setTransferOptions] = useState<TransferOption[]>([]);
    const [loadingTransferOptions, setLoadingTransferOptions] = useState(false);
    const [
        returnableMovements,
        setReturnableMovements,
    ] = useState<ReturnableMovement[]>([]);

    const [
        loadingMovements,
        setLoadingMovements,
    ] = useState(false);


    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm<FormData>({
            type: 'consumption',
            stock_id: '',
            quantity: '',
            new_quantity: '',
            destination_sector_id: '',
            movement_id: '',
            destination_user_id: '',

            employee_id: '',

            team_id: '',

            application_area_id: '',

            notes: '',
        });


    useEffect(() => {
        if (!movementType || !stock || !open) return;
        clearErrors();
        setData({
            type: movementType,
            stock_id: stock.id,
            quantity: '',
            new_quantity: '',
            destination_sector_id: '',
            movement_id: lockedMovementId ?? '',
            destination_user_id: '',

            employee_id: '',

            team_id: '',

            application_area_id: '',

            notes: '',
        });
    }, [movementType, stock, open]);

    useEffect(() => {

        if (movementType === 'return') {
            return;
        }

        setData(
            'employee_id',
            '',
        );

    }, [
        data.team_id,
    ]);

    useEffect(() => {
        if (movementType !== 'transfer' || !stock || !open) {
            setTransferOptions([]);
            return;
        }
        let cancelled = false;
        setLoadingTransferOptions(true);
        axios
            .get(
                route('warehouse.projects.transfer-options', {
                    project: projectId,
                    stock: stock.id,
                }),
            )
            .then((res) => {
                if (!cancelled) setTransferOptions(res.data);
            })
            .finally(() => { if (!cancelled) setLoadingTransferOptions(false); });
        return () => { cancelled = true; };
    }, [movementType, stock, open]);

    useEffect(() => {

        if (
            !open ||
            movementType !== 'return'
        ) {
            return;
        }

        setLoadingMovements(true);

        axios.get(
            route(
                'warehouse.projects.movements.returnable',
                {
                    project: projectId,
                },
            ),
        ).then(
            ({ data }) =>
                setReturnableMovements(
                    data,
                ),
        )
            .finally(
                () =>
                    setLoadingMovements(
                        false,
                    ),
            );

    }, [
        open,
        movementType,
    ]);
    useEffect(() => {

        if (!data.movement_id) {
            return;
        }

        const movement =
            returnableMovements.find(
                (item) =>
                    item.id ===
                    data.movement_id,
            );

        if (!movement) {
            return;
        }

        setData((prev) => ({
            ...prev,
            stock_id: movement.stock_id,
            employee_id: movement.employee_id ?? '',
            team_id: movement.team_id ?? '',
        }));

    }, [
        data.movement_id,
        returnableMovements,
    ]);

    if (!open || !movementType || !stock) return null;

    function closeModal() {
        reset();
        clearErrors();
        setTransferOptions([]);
        setReturnableMovements([]);
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('warehouse.projects.movements.store', projectId), {
            preserveScroll: true,
            onSuccess: closeModal,
        });
    }

    const userOptions: SelectOption[] = projectUsers.map((u) => ({
        value: u.id,
        label: u.name,
        sublabel: u.email,
    }));


    const teamOptions: SelectOption[] =
        teams.map(
            (team) => ({
                value: team.id,
                label: team.name,
            }),
        );

    const applicationAreaOptions: SelectOption[] =
        applicationAreas.map(
            (area) => ({
                value: area.id,
                label: area.name,
            }),
        );

    const selectedTeam =
        teams.find(
            (team) =>
                team.id === data.team_id,
        );

    const employeeOptions: SelectOption[] =
        selectedTeam
            ? selectedTeam.employees.map(
                (employee) => ({
                    value: employee.id,
                    label: employee.name,
                }),
            )
            : [];

    const transferSelectOptions: SelectOption[] = transferOptions.map((t) => ({
        value: t.id,
        label: `${t.project.name} - ${t.sector?.name}`,
        sublabel: `${t.sector?.name ?? 'Sem setor'} · Saldo: ${t.stock_quantity}`,
    }));

    const selectedReturnMovement =
        returnableMovements.find(
            movement =>
                movement.id ===
                data.movement_id,
        );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-semibold ">
                            {TITLES[movementType]}
                        </h2>
                        <p className="mt-1 ">
                            {stock.product.name}
                        </p>
                        <p className="mt-1 ">
                            Saldo atual: {stock.stock_quantity}{' '}
                            {stock.product.unit ?? ''}
                        </p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="rounded-xl p-2 transition hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* BODY */}
                <form onSubmit={submit} className="space-y-6 p-6">

                    {movementType === 'return' && (
                        <Field>
                            <Label> Movimentação origem</Label>

                            {lockedMovementId ? (
                                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm ">
                                    <span className="flex-1">
                                        {returnableMovements.find(m => m.id === lockedMovementId)?.label
                                            ?? `#${lockedMovementId}`}
                                    </span>
                                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium ">
                                        fixo
                                    </span>
                                </div>
                            ) : (
                                <CustomSelect options={returnableMovements.map((movement,) => ({
                                    value: movement.id,
                                    label: movement.label,
                                }),
                                )
                                }
                                    value={data.movement_id}
                                    onChange={(id) => setData('movement_id', id,)
                                    }
                                    loading={
                                        loadingMovements
                                    }
                                />
                            )}

                            <ErrorMessage>
                                {errors.movement_id}
                            </ErrorMessage>
                        </Field>
                    )}
                    {selectedReturnMovement && (
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
                            <div>
                                <strong>Produto:</strong>{' '}
                                {selectedReturnMovement.product}
                            </div>

                            <div>
                                <strong>Saldo disponível:</strong>{' '}
                                {selectedReturnMovement.available_quantity}
                            </div>

                            <div>
                                <strong>Colaborador:</strong>{' '}
                                {selectedReturnMovement.employee}
                            </div>

                            <div>
                                <strong>Equipe:</strong>{' '}
                                {selectedReturnMovement.team}
                            </div>
                        </div>
                    )}

                    {/* QUANTITY */}
                    {movementType !== 'adjust' && (
                        <Field>
                            <Label>Quantidade</Label>
                            <input
                                type="number"
                                min="0"
                                max={stock?.stock_quantity}
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                className={inputClass}
                            />
                            <ErrorMessage>{errors.quantity}</ErrorMessage>
                        </Field>
                    )}

                    {/* ADJUST */}
                    {movementType === 'adjust' && (
                        <Field>
                            <Label>Nova quantidade real</Label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.new_quantity}
                                onChange={(e) => setData('new_quantity', e.target.value)}
                                className={inputClass}
                            />
                            <ErrorMessage>{errors.new_quantity}</ErrorMessage>
                        </Field>
                    )}

                    {/* TRANSFER */}
                    {movementType === 'transfer' && (
                        <Field>
                            <Label>Estoque destino</Label>
                            <CustomSelect
                                options={transferSelectOptions}
                                value={data.destination_sector_id}
                                onChange={(id) => setData('destination_sector_id', id)}
                                placeholder="Selecione um destino"
                                loading={loadingTransferOptions}
                                loadingText="Carregando destinos..."
                            />
                            <ErrorMessage>{errors.destination_sector_id}</ErrorMessage>
                        </Field>

                    )}

                    {movementType === 'transfer' && (
                        <Field>
                            <Label>Responsável destino</Label>

                            <CustomSelect
                                options={userOptions}
                                value={data.destination_user_id}
                                onChange={(id) =>
                                    setData(
                                        'destination_user_id',
                                        id,
                                    )
                                }
                                placeholder="Selecione o responsável"
                                loading={loadingUsers}
                                loadingText="Carregando usuários..."
                            />

                            <ErrorMessage>
                                {errors.destination_user_id}
                            </ErrorMessage>
                        </Field>
                    )}

                    {['consumption', 'assignment', 'return'].includes(movementType) && (
                        <Field>
                            <Label>Equipe</Label>

                            <CustomSelect
                                options={teamOptions}
                                value={data.team_id}
                                onChange={(id) =>
                                    setData('team_id', id)
                                }
                                placeholder="Selecione uma equipe"
                            />

                            <ErrorMessage>
                                {errors.team_id}
                            </ErrorMessage>
                        </Field>
                    )}

                    {['consumption', 'assignment', 'return'].includes(movementType) && (
                        <Field>
                            <Label>Colaborador</Label>

                            <CustomSelect
                                options={employeeOptions}
                                disabled={
                                    !data.team_id 
                                }
                                value={data.employee_id}
                                onChange={(id) =>
                                    setData('employee_id', id)
                                }
                                placeholder={
                                    data.team_id
                                        ? 'Selecione um colaborador'
                                        : 'Selecione uma equipe primeiro'
                                }
                            />

                            <ErrorMessage>
                                {errors.employee_id}
                            </ErrorMessage>
                        </Field>
                    )}

                    {movementType === 'consumption' && (
                        <Field>
                            <Label>Área de Aplicação</Label>

                            <CustomSelect
                                options={
                                    applicationAreaOptions
                                }
                                value={
                                    data.application_area_id
                                }
                                onChange={(id) =>
                                    setData(
                                        'application_area_id',
                                        id,
                                    )
                                }
                                placeholder="Selecione uma área"
                            />

                            <ErrorMessage>
                                {
                                    errors.application_area_id
                                }
                            </ErrorMessage>
                        </Field>
                    )}

                    {/* ASSIGNMENT
                    {movementType === 'assignment' && (
                        <Field>
                            <Label>Usuário destino</Label>
                            <CustomSelect
                                options={userOptions}
                                value={data.destination_user_id}
                                onChange={(id) => setData('destination_user_id', id)}
                                placeholder="Selecione um usuário"
                                loading={loadingUsers}
                                loadingText="Carregando usuários..."
                            />
                            <ErrorMessage>{errors.destination_user_id}</ErrorMessage>
                        </Field>
                    )} */}

                    {/* NOTES */}
                    <Field>
                        <Label>Observações</Label>
                        <textarea
                            rows={4}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className={inputClass}
                            placeholder="Observações da movimentação..."
                        />
                        <ErrorMessage>{errors.notes}</ErrorMessage>
                    </Field>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-2xl border border-slate-200 px-5 py-2.5 font-medium transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing && (
                                <Loader2 size={16} className="animate-spin" />
                            )}
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| UI HELPERS
|--------------------------------------------------------------------------
*/

const inputClass =
    'w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500';

function Field({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-2 block text-sm font-medium ">
            {children}
        </label>
    );
}

function ErrorMessage({ children }: { children?: React.ReactNode }) {
    if (!children) return null;
    return <p className="mt-2 text-sm text-red-600">{children}</p>;
}