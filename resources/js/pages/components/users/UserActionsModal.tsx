import Modal from '@/pages/components/Modal';
import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';

import UpdateUserEmailModal from './UpdateEmailModal';
import UpdateUserPasswordModal from './UpdatePasswordModal';
import UpdateUserProfileModal from './EditUserModal';
import ActionItem from './ActionItem'

// ── Tipos ─────────────────────────────────────────

type UserData = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    user: UserData;
};

type ActionType = 'profile' | 'password' | 'email' | null;

// ── Componente ────────────────────────────────────

export default function UserActionsModal({ open, onClose, user }: Props) {

    const [action, setAction] = useState<ActionType>(null);

    function handleClose() {
        setAction(null);
        onClose();
    }

    return (
        <>
            {/* MODAL PRINCIPAL */}
            <Modal open={open && !action} onClose={handleClose} title="Gerenciar usuário">

                <div className="space-y-4">

                    {/* Info do usuário */}
                    <div className="p-3 rounded-xl bg-slate-50 border">
                        <p className="text-sm font-semibold text-slate-800">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {user.email}
                        </p>
                    </div>

                    {/* Lista de ações */}
                    <div className="space-y-2">

                        <ActionItem
                            icon={User}
                            label="Editar dados"
                            description="Alterar nome do usuário"
                            onClick={() => setAction('profile')}
                        />

                        <ActionItem
                            icon={Mail}
                            label="Alterar e-mail"
                            description="Atualizar e reenviar verificação"
                            onClick={() => setAction('email')}
                        />

                        <ActionItem
                            icon={Lock}
                            label="Alterar senha"
                            description="Definir nova senha"
                            onClick={() => setAction('password')}
                        />

                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end pt-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                        >
                            Fechar
                        </button>
                    </div>

                </div>

            </Modal>

            {/* MODAIS FILHOS */}
            <UpdateUserProfileModal
                open={action === 'profile'}
                onClose={() => setAction(null)}
                user={user}
            />

            <UpdateUserEmailModal
                open={action === 'email'}
                onClose={() => setAction(null)}
                user={user}
            />

            <UpdateUserPasswordModal
                open={action === 'password'}
                onClose={() => setAction(null)}
                userId={user.id}
            />
        </>
    );
}