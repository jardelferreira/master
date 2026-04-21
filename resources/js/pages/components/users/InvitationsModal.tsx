import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import Modal from '@/pages/components/Modal';
import {
    CheckCircle,
    Clock,
    XCircle,
    Copy,
    RefreshCw,
    Trash2,
    Search,
    ExternalLink,
} from 'lucide-react';
import { showToast } from '@/lib/alerts/toast';
import { Link } from '@inertiajs/react';

type Invitation = {
    id: number;
    email: string;
    status: 'pending' | 'accepted' | 'expired';
    expires_at: string;
    accepted_at: string;
    invited_by?: string;
    link: string;
};

export default function InvitationsModal({ open, onClose }: any) {
    const [data, setData] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    async function fetchInvites() {
        setLoading(true);
        try {
            const { data } = await api.get(route('admin.users.invitatios.get'));
            setData(data);
        } catch (err: any) {
            showToast('error', err?.message || 'Erro ao carregar');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) fetchInvites();
    }, [open]);

    function copy(link: string) {
        navigator.clipboard.writeText(link);
        showToast('success', 'Link copiado');
    }

    async function resend(id: number) {
        setProcessingId(id);
        try {
            await api.post(route('admin.invitations.resend', id));
            showToast('success', 'Convite reenviado');
        } catch {
            showToast('error', 'Erro ao reenviar');
        } finally {
            setProcessingId(null);
        }
    }

    async function remove(id: number) {
        setProcessingId(id);
        try {
            await api.delete(route('admin.invitations.destroy', id));
            setData((prev) => prev.filter((i) => i.id !== id));
            showToast('success', 'Convite removido');
        } catch {
            showToast('error', 'Erro ao remover');
        } finally {
            setProcessingId(null);
            setConfirmDelete(null);
        }
    }

    const statusMap = {
        pending: {
            label: 'Pendentes',
            color: 'bg-yellow-100 text-yellow-700',
            icon: Clock,
        },
        accepted: {
            label: 'Aceitos',
            color: 'bg-green-100 text-green-700',
            icon: CheckCircle,
        },
        expired: {
            label: 'Expirados',
            color: 'bg-red-100 text-red-600',
            icon: XCircle,
        },
    };

    // 🔍 filtro
    const filtered = useMemo(() => {
        return data.filter((i) =>
            i.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    // 📦 agrupamento
    const grouped = useMemo(() => {
        return {
            pending: filtered.filter((i) => i.status === 'pending'),
            accepted: filtered.filter((i) => i.status === 'accepted'),
            expired: filtered.filter((i) => i.status === 'expired'),
        };
    }, [filtered]);

    return (
        <Modal open={open} onClose={onClose} title="Convites enviados" size='xl'>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4 gap-3">

                {/* 🔍 busca */}
                <div className="relative w-full max-w-xs">
                    <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por email..."
                        className="w-full pl-8 pr-3 py-2 text-sm rounded-md border bg-gray-50"
                    />
                </div>

                {/* refresh */}
                <button
                    onClick={fetchInvites}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                    <RefreshCw size={14} />
                </button>
            </div>

            {/* CONTENT */}
            <div className="space-y-5 max-h-[450px] overflow-y-auto">

                {loading && (
                    <p className="text-sm text-gray-500">Carregando...</p>
                )}

                {!loading && filtered.length === 0 && (
                    <p className="text-sm text-gray-500">
                        Nenhum resultado encontrado.
                    </p>
                )}

                {Object.entries(grouped).map(([key, items]) => {
                    if (items.length === 0) return null;

                    const status = statusMap[key as keyof typeof statusMap];
                    const Icon = status.icon;

                    return (
                        <div key={key}>
                            {/* HEADER GRUPO */}
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.color}`}
                                >
                                    <Icon size={14} />
                                    {status.label} ({items.length})
                                </span>
                            </div>

                            {/* ITEMS */}
                            <div className="space-y-2">
                                {items.map((inv) => {
                                    const isProcessing = processingId === inv.id;

                                    return (
                                        <div
                                            key={inv.id}
                                            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {inv.email}
                                                </p>
                                                {inv.accepted_at ? (
                                                    <p className="text-xs text-green-700 bg-green-100">
                                                        Aceito {inv.accepted_at}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-yellow-700 bg-yellow-100">
                                                        Expira {inv.expires_at}
                                                    </p>
                                                )

                                                }

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <a
                                                    title='Acessar'
                                                    href={inv.link}
                                                    target='_blank'
                                                    className="p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>

                                                {inv.status === 'pending' && (
                                                    <button
                                                        title='Reenviar'
                                                        onClick={() => resend(inv.id)}
                                                        disabled={isProcessing}
                                                        className="cursor-pointer p-2 hover:bg-gray-200 rounded-md"
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                )}

                                                {/* delete com confirmação inline */}
                                                {confirmDelete === inv.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            title='Excluir'
                                                            onClick={() => remove(inv.id)}
                                                            className="cursor-pointer text-xs px-2 py-1 bg-red-500 text-white rounded"
                                                        >
                                                            Confirmar
                                                        </button>
                                                        <button
                                                            title='Cancelar'
                                                            onClick={() => setConfirmDelete(null)}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        title='Excluir'
                                                        onClick={() => setConfirmDelete(inv.id)}
                                                        className="cursor-pointer p-2 hover:bg-red-100 text-red-600 rounded-md"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}