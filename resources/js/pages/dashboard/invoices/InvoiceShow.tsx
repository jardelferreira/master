import { Head, usePage, router } from "@inertiajs/react";
import DashboardLayout from "@/pages/layouts/dashboard/DashboardLayout";
import { PageContainer } from "@/pages/components/PageContainer";
import { formatCurrency } from "@/utils/formatValues";
import { useState } from "react";
import {
    CheckCircle,
    DollarSign,
    PackageCheck,
    Truck,
    Search,
    XCircle,
    RotateCcw,
    Plus,
    Building2,
    FolderOpen,
    Layers,
    Factory,
    PlusCircle,
    ChevronDown,
    ChevronUp,
    Warehouse,
    ClipboardList,
    ArrowLeftRight,
} from "lucide-react";
import ItemActionModal from "@/pages/components/invoices/ItemActionModal";
import Big from 'big.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types — alinhados ao InvoiceShowResource.php
// ─────────────────────────────────────────────────────────────────────────────

type StatusBadgeShape = { value: string; label: string; color: string };

type InvoiceMovement = {
    id: number;
    type: { value: string; label: string; color: string };
    user?: string;
    date: string;
    date_human: string;
};

type ItemMovement = {
    id: number;
    type: { value: string; label: string };
    quantity: number;
    user?: string;
    date: string;
    date_human: string;
};

type ItemWorkflow = {
    received: number;
    inspected: number;
    approved: number;
    rejected: number;
    stocked: number;
    receivable: number;
    inspectable: number;
    decidable: number;
    stockable: number;
    completed: boolean;
};

type ItemActions = {
    can_receive: boolean;
    can_inspect: boolean;
    can_decide: boolean;
    can_stock: boolean;
};

type InvoiceItem = {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    delivery_status: StatusBadgeShape;
    workflow: ItemWorkflow;
    actions: ItemActions;
    movements: ItemMovement[];
};

type Invoice = {
    id: number;
    number: string;
    series: string;
    status: StatusBadgeShape;
    can: {
        pay: boolean;
        complete: boolean;
        cancel: boolean;
        return: boolean;
        move_items: boolean;
    };
    total: number;
    amount: number;
    provider: { id: number; trade_name?: string; name: string };
    project: { id: number; name?: string };
    sector: { id: number; name?: string };
    items: InvoiceItem[];
    movements: InvoiceMovement[];
};

type PageProps = { invoice: Invoice };

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────

const tk = {
    card: "bg-white border border-blue-100 rounded-2xl shadow-sm",
    cardBlue: "bg-white border border-blue-600 rounded-2xl shadow-sm",
    sectionTitle:
        "text-[11px] font-bold uppercase tracking-widest text-blue-800",
    textPrimary: "text-zinc-900",
    textSecondary: "text-zinc-500",
    textTertiary: "text-zinc-400",
    divider: "border-t border-zinc-100",
};

// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StatusBadgeShape }) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${status.color}`}
        >
            {status.label}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProgressBar — valor e total já vêm do backend
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({
    value,
    total,
    color = "bg-blue-500",
}: {
    value: number;
    total: number;
    color?: string;
}) {
    const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
    return (
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkflowRow — linha de progresso com label e contadores
// ─────────────────────────────────────────────────────────────────────────────

function WorkflowRow({
    label,
    value,
    total,
    color,
}: {
    label: string;
    value: number;
    total: number;
    color: string;
}) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-zinc-500">
                <span>{label}</span>
                <span className="text-zinc-800 tabular-nums">
                    {value.toFixed(2)}&nbsp;/&nbsp;{total.toFixed(2)}
                </span>
            </div>
            <ProgressBar value={value} total={total} color={color} />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkflowChips — chip summary por item (abaixo do cabeçalho)
// ─────────────────────────────────────────────────────────────────────────────

function WorkflowChips({ wf, total }: { wf: ItemWorkflow; total: number }) {
    const chips: { label: string; value: number; cls: string }[] = [
        {
            label: "Receber",
            value: wf.receivable,
            cls: "bg-blue-50 text-blue-700 border border-blue-200",
        },
        {
            label: "Inspecionar",
            value: wf.inspectable,
            cls: "bg-violet-50 text-violet-700 border border-violet-200",
        },
        {
            label: "Decidir",
            value: wf.decidable,
            cls: "bg-amber-50 text-amber-700 border border-amber-200",
        },
        {
            label: "Estoque",
            value: wf.stockable,
            cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        },
    ];

    return (
        <div className="flex flex-wrap gap-1.5">
            {chips.map(
                (c) =>
                    c.value > 0 && (
                        <span
                            key={c.label}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${c.cls}`}
                        >
                            {c.label}: {c.value.toFixed(2)}
                        </span>
                    )
            )}
            {wf.completed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
                    ✓ Concluído
                </span>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// InvoiceMovementTimeline
// ─────────────────────────────────────────────────────────────────────────────

function MovementTimeline({ movements }: { movements: InvoiceMovement[] }) {
    if (!movements.length) {
        return (
            <p className={`text-sm italic ${tk.textTertiary}`}>
                Nenhum histórico registrado.
            </p>
        );
    }
    return (
        <div className="flex flex-col gap-0">
            {movements.map((m, i) => (
                <div key={m.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-100" />
                        {i < movements.length - 1 && (
                            <div className="w-px flex-1 bg-zinc-200 my-1" />
                        )}
                    </div>
                    <div className="pb-3">
                        <p className={`text-sm font-semibold ${tk.textPrimary}`}>
                            {m.type.label}
                        </p>
                        <p className={`text-xs ${tk.textSecondary} mt-0.5`}>
                            {m.user ?? "Sistema"} · {m.date}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-blue-500">
                            {m.date_human}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ItemHistoryTimeline — expansível por item
// ─────────────────────────────────────────────────────────────────────────────

function ItemHistoryTimeline({ movements }: { movements: ItemMovement[] }) {
    if (!movements.length) {
        return (
            <p className={`text-xs italic ${tk.textTertiary} py-1`}>
                Nenhuma movimentação.
            </p>
        );
    }
    return (
        <div className="flex flex-col gap-0 pt-1">
            {movements.map((m, i) => (
                <div key={m.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                        {i < movements.length - 1 && (
                            <div className="w-px flex-1 bg-zinc-200 my-1" />
                        )}
                    </div>
                    <div className="pb-2.5">
                        <p className="text-xs font-semibold text-zinc-800">
                            {m.type.label}
                            <span className="ml-2 font-normal text-zinc-500">
                                ({m.quantity.toFixed(2)})
                            </span>
                        </p>
                        <p className={`text-[11px] ${tk.textSecondary}`}>
                            {m.user ?? "Sistema"} · {m.date}
                        </p>
                        <p className="text-[11px] text-emerald-600">
                            {m.date_human}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Btn utilitário com loading state
// ─────────────────────────────────────────────────────────────────────────────

const BASE_BTN =
    "inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

function ActionButton({
    loading,
    disabled,
    onClick,
    className,
    children,
}: {
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${BASE_BTN} ${className}`}
        >
            {loading ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                children
            )}
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ItemCard — card principal de cada item
// ─────────────────────────────────────────────────────────────────────────────

type ModalAction = {
    route: string;
    title: string;
    itemId: number;
    quantity: number;
};

function ItemCard({
    item,
    name,
    canMoveItems,
    onAction,
    loadingItemId,
}: {
    item: InvoiceItem;
    name: string;
    canMoveItems: boolean;
    onAction: (action: ModalAction) => void;
    loadingItemId: number | null;
}) {
    const [historyOpen, setHistoryOpen] = useState(false);
    const { workflow: wf, actions } = item;
    const isDone = wf.completed;
    const isLoading = loadingItemId === item.id;

    return (
        <div id={item.id.toLocaleString()}
            className={`bg-white p-4 rounded-2xl border transition-all ${isDone ? "border-emerald-300 bg-emerald-50/20" : "border-blue-200"
                }`}
        >
            {/* ── Item Header ─────────────────────── */}
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm uppercase font-semibold text-blue-600">
                            {name}
                        </span>
                        <StatusBadge status={item.delivery_status} />
                    </div>
                    {/* <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-800">
                            Item #{item.id}
                        </span>
                        <StatusBadge status={item.delivery_status} />
                    </div> */}
                    <div className="mt-1 text-xs text-zinc-500 flex flex-wrap gap-2">
                        <span>
                            Qtd:{" "}
                            <strong className="text-zinc-800">
                                {item.quantity.toFixed(2)}
                            </strong>
                        </span>
                        <span>·</span>
                        <span>
                            Unit.:{" "}
                            <strong className="text-zinc-800">
                                {formatCurrency(item.unit_price)}
                            </strong>
                        </span>
                        <span>·</span>
                        <span>
                            Total:{" "}
                            <strong className="text-zinc-800">
                                {formatCurrency(item.unit_price * item.quantity)}
                            </strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Chips de pendências ──────────────── */}
            <div className="mt-3">
                <WorkflowChips wf={wf} total={item.quantity} />
            </div>

            {/* ── Barras de progresso ──────────────── */}
            <div className="mt-3 space-y-2">
                <WorkflowRow
                    label="Recebido"
                    value={wf.received}
                    total={item.quantity}
                    color="bg-blue-500"
                />
                <WorkflowRow
                    label="Inspecionado"
                    value={wf.inspected}
                    total={item.quantity}
                    color="bg-violet-500"
                />
                <WorkflowRow
                    label="Aprovado"
                    value={wf.approved}
                    total={item.quantity}
                    color="bg-emerald-500"
                />
                {wf.rejected > 0 && (
                    <WorkflowRow
                        label="Rejeitado"
                        value={wf.rejected}
                        total={item.quantity}
                        color="bg-red-400"
                    />
                )}
                {/* <WorkflowRow
                    label="Estocado"
                    value={wf.stocked}
                    total={item.quantity}
                    color="bg-teal-500"
                /> */}
            </div>

            {/* ── Ações contextuais ───────────────── */}
            <div className={`mt-4 pt-3 ${tk.divider}`}>
                {canMoveItems ? (
                    <div className="flex flex-wrap gap-2">
                        {actions.can_receive && (
                            <ActionButton
                                loading={isLoading}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() =>
                                    onAction({
                                        route: "admin.invoices.items.receive",
                                        title: "Receber item",
                                        itemId: item.id,
                                        quantity: wf.receivable,
                                    })
                                }
                            >
                                <Truck size={13} />
                                Receber ({wf.receivable.toFixed(2)})
                            </ActionButton>
                        )}

                        {actions.can_inspect && (
                            <ActionButton
                                loading={isLoading}
                                className="bg-violet-600 text-white hover:bg-violet-700"
                                onClick={() =>
                                    onAction({
                                        route: "admin.invoices.items.inspect",
                                        title: "Inspecionar item",
                                        itemId: item.id,
                                        quantity: wf.inspectable,
                                    })
                                }
                            >
                                <Search size={13} />
                                Inspecionar ({wf.inspectable.toFixed(2)})
                            </ActionButton>
                        )}

                        {actions.can_decide && (
                            <>
                                <ActionButton
                                    loading={isLoading}
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                    onClick={() =>
                                        onAction({
                                            route: "admin.invoices.items.approve",
                                            title: "Aprovar item",
                                            itemId: item.id,
                                            quantity: wf.decidable,
                                        })
                                    }
                                >
                                    <PackageCheck size={13} />
                                    Aprovar ({wf.decidable.toFixed(2)})
                                </ActionButton>
                                <ActionButton
                                    loading={isLoading}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={() =>
                                        onAction({
                                            route: "admin.invoices.items.reject",
                                            title: "Rejeitar item",
                                            itemId: item.id,
                                            quantity: wf.decidable,
                                        })
                                    }
                                >
                                    <XCircle size={13} />
                                    Rejeitar
                                </ActionButton>
                            </>
                        )}

                        {wf.approved < item.quantity && wf.rejected == 0 && (
                            
                            <ActionButton
                                loading={isLoading}
                                className="bg-teal-600 text-white hover:bg-teal-700"
                                onClick={() =>
                                    onAction({
                                        route: "admin.invoices.items.forceSendToStock",
                                        title: "Enviar ao estoque",
                                        itemId: item.id,
                                        quantity: wf.stockable > 0 ? wf.stockable : item.quantity,
                                    })
                                }
                            >
                                <Warehouse size={13} />
                                Enviar ao estoque 
                            </ActionButton>
                        )}

                        {!actions.can_receive &&
                            !actions.can_inspect &&
                            !actions.can_decide &&
                            !actions.can_stock && (
                                <p className={`text-xs italic ${tk.textTertiary}`}>
                                    Nenhuma ação disponível para este item.
                                </p>
                            )}
                    </div>
                ) : (
                    <p className={`text-xs italic ${tk.textTertiary}`}>
                        Libere a nota para movimentar os itens.
                    </p>
                )}
            </div>

            {/* ── Histórico expansível ─────────────── */}
            {item.movements.length > 0 && (
                <div className={`mt-3 pt-3 ${tk.divider}`}>
                    <button
                        onClick={() => setHistoryOpen((v) => !v)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition"
                    >
                        <ClipboardList size={12} />
                        Histórico ({item.movements.length})
                        {historyOpen ? (
                            <ChevronUp size={12} />
                        ) : (
                            <ChevronDown size={12} />
                        )}
                    </button>
                    {historyOpen && (
                        <div className="mt-2">
                            <ItemHistoryTimeline movements={item.movements} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// InfoRow — linha de metadado do resumo
// ─────────────────────────────────────────────────────────────────────────────

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
}) {
    return (
        <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {label}
                </p>
                <p className="text-sm font-semibold text-zinc-800 break-words">
                    {value ?? "—"}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function InvoiceShow() {
    const { invoice } = usePage<PageProps>().props;

    // ── Loading por ação de nota ──────────────────────────────────────────
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    function invoicePost(routeName: string) {
        setLoadingAction(routeName);
        router.post(
            route(routeName, invoice.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoadingAction(null),
            }
        );
    }

    // ── Modal de ação de item ─────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [action, setAction] = useState<ModalAction | null>(null);
    const [loadingItemId, setLoadingItemId] = useState<number | null>(null);

    function openAction(a: ModalAction) {
        setAction(a);
        setModalOpen(true);
    }

    function handleModalSubmit(itemId: number) {
        setLoadingItemId(itemId);
        setModalOpen(false);
    }

    function handleModalFinish() {
        setLoadingItemId(null);
    }

    return (
        <>
            <Head title={`NF ${invoice.number}/${invoice.series}`} />

            <PageContainer>
                <div className="space-y-3">

                    {/* ── PAGE HEADER ──────────────────────────────────────────── */}
                    <div className="bg-white border border-blue-200 rounded-2xl px-6 py-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold text-zinc-900">
                                {invoice.provider.trade_name || invoice.provider.name}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-zinc-500">
                                    NF {invoice.number}/{invoice.series}
                                </span>
                                <StatusBadge status={invoice.status} />
                            </div>
                            <p className="text-sm font-bold text-zinc-700">
                                {formatCurrency(invoice.total)}
                            </p>
                        </div>

                        {/* Ações da nota */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {invoice.can.pay && (
                                <ActionButton
                                    loading={loadingAction === "admin.invoices.pay"}
                                    onClick={() => invoicePost("admin.invoices.pay")}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    <DollarSign size={14} />
                                    Pagar
                                </ActionButton>
                            )}
                            {invoice.can.complete && (
                                <ActionButton
                                    loading={loadingAction === "admin.invoices.complete"}
                                    onClick={() => invoicePost("admin.invoices.complete")}
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    <CheckCircle size={14} />
                                    Liberar
                                </ActionButton>
                            )}
                            {invoice.can.return && (
                                <ActionButton
                                    loading={loadingAction === "admin.invoices.return"}
                                    onClick={() => invoicePost("admin.invoices.return")}
                                    className="border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                                >
                                    <RotateCcw size={14} />
                                    Devolver
                                </ActionButton>
                            )}
                            {invoice.can.cancel && (
                                <ActionButton
                                    loading={loadingAction === "admin.invoices.cancel"}
                                    onClick={() => invoicePost("admin.invoices.cancel")}
                                    className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                >
                                    <XCircle size={14} />
                                    Cancelar
                                </ActionButton>
                            )}
                            <button
                                onClick={() =>
                                    router.visit(route("admin.invoices.create"))
                                }
                                className={`${BASE_BTN} border border-blue-200 bg-white text-blue-700 hover:bg-blue-50`}
                            >
                                <Plus size={14} />
                                Nova Nota
                            </button>
                        </div>
                    </div>

                    {/* ── BODY: items (2/3) + sidebar (1/3) ───────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                        {/* ── COLUNA ITENS ─────────────────────────────────────── */}
                        <div className="lg:col-span-2 space-y-3">
                            <p className={tk.sectionTitle}>
                                Itens da nota ({invoice.items.length})
                            </p>

                            {invoice.items.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    name={item.name}
                                    canMoveItems={invoice.can.move_items}
                                    onAction={openAction}
                                    loadingItemId={loadingItemId}
                                />
                            ))}

                            {invoice.items.length === 0 && (
                                <div className={`${tk.card} p-8 text-center`}>
                                    <p className={`text-sm italic ${tk.textTertiary}`}>
                                        Nenhum item cadastrado.
                                    </p>
                                    {invoice.status.value === "completed" && (
                                        <button
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        "admin.invoices.items.create",
                                                        invoice.id
                                                    )
                                                )
                                            }
                                            className={`mt-4 ${BASE_BTN} bg-blue-600 text-white hover:bg-blue-700 mx-auto`}
                                        >
                                            <PlusCircle size={14} />
                                            Adicionar itens
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── SIDEBAR ──────────────────────────────────────────── */}
                        <div className="space-y-3">

                            {/* Dados da nota */}
                            <div className={`${tk.cardBlue} p-4 space-y-3`}>
                                <p className={`${tk.sectionTitle} text-center`}>
                                    Dados da nota
                                </p>
                                <InfoRow
                                    icon={<Factory size={14} />}
                                    label="Fornecedor"
                                    value={
                                        invoice.provider.trade_name ||
                                        invoice.provider.name
                                    }
                                />
                                <InfoRow
                                    icon={<FolderOpen size={14} />}
                                    label="Projeto"
                                    value={invoice.project.name}
                                />
                                <InfoRow
                                    icon={<Layers size={14} />}
                                    label="Setor"
                                    value={invoice.sector.name}
                                />
                                <div className={`pt-3 ${tk.divider} flex justify-between items-center`}>
                                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">
                                        Total
                                    </span>
                                    <span className="text-base font-bold text-zinc-900">
                                        {formatCurrency(invoice.amount)}
                                    </span>
                                </div>
                            </div>

                            {/* Histórico da nota */}
                            <div className={`${tk.cardBlue} p-4 space-y-3`}>
                                <div className="relative flex items-center gap-3">
                                    <div className="flex-grow border-t border-blue-200" />
                                    <span className={`shrink-0 ${tk.sectionTitle}`}>
                                        Histórico
                                    </span>
                                    <div className="flex-grow border-t border-blue-200" />
                                </div>
                                <MovementTimeline movements={invoice.movements} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── MODAL DE AÇÃO DE ITEM ─────────────────────────────────── */}
                <ItemActionModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    routeName={action?.route ?? ""}
                    itemId={action?.itemId ?? null}
                    title={action?.title ?? ""}
                    quantity={action?.quantity ?? 0}
                    onSubmit={(itemId) => handleModalSubmit(itemId)}
                    onFinish={handleModalFinish}
                />
            </PageContainer>
        </>
    );
}

InvoiceShow.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);