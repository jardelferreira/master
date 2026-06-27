import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    CircleOff,
    ClipboardCheck,
} from 'lucide-react';

import ConfirmModal from '@/pages/components/ConfirmModal';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/alerts/toast';

interface InventoryPermissions {
    can_finish: boolean;
    can_cancel: boolean;
    can_approve: boolean;
}

interface InventoryStatus {
    permissions: InventoryPermissions;
}

interface Inventory {
    id: number;
    status: InventoryStatus;
}

interface Props {
    inventory: Inventory;
}

type Action = 'finish' | 'cancel' | 'approve' | null;

export default function InventoryActionButtons({
    inventory,
}: Props) {
    const [action, setAction] = useState<Action>(null);

    const close = () => setAction(null);
    const form = useForm({});

    const confirm = () => {
        const routeName = {
            finish: 'admin.inventories.finish',
            cancel: 'admin.inventories.cancel',
            approve: 'admin.inventories.approve',
        }[action!];

        form.post(route(routeName, inventory.id), {
            preserveScroll: true,
            onFinish: () => {
                    
                close()
            },
            onError: (errors) => {
                // showAlert('error',errors.inventory)
                showToast('error',errors.inventory)
            }
        });
    };

    const modal = {
        finish: {
            title: 'Finalizar inventário',
            description:
                'Após finalizar, os operadores não poderão mais realizar alterações neste inventário.',
            confirmText: 'Finalizar',
            variant: 'primary' as const,
        },

        approve: {
            title: 'Aprovar inventário',
            description:
                'A aprovação aplicará automaticamente todos os ajustes de estoque encontrados no inventário.',
            confirmText: 'Aprovar',
            variant: 'primary' as const,
        },

        cancel: {
            title: 'Cancelar inventário',
            description:
                'Esta ação cancelará o inventário e impedirá sua continuidade.',
            confirmText: 'Cancelar inventário',
            variant: 'destructive' as const,
        },
    };

    return (
        <>
            <div className="flex items-center gap-2">

                {inventory.status.permissions.can_cancel && (
                    <Button
                        variant="destructive"
                        onClick={() => setAction('cancel')}
                    >
                        <CircleOff className="mr-2 h-4 w-4" />
                        Cancelar
                    </Button>
                )}

                {inventory.status.permissions.can_finish && (
                    <Button
                        variant="secondary"
                        onClick={() => setAction('finish')}
                    >
                        <ClipboardCheck className="mr-2 h-4 w-4" />
                        Finalizar
                    </Button>
                )}

                {inventory.status.permissions.can_approve && (
                    <Button
                        variant='default'
                        className='bg-green-600'
                        onClick={() => setAction('approve')}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Aprovar
                    </Button>
                )}

            </div>

            {action && (
                <ConfirmModal
                    title={modal[action].title}
                    description={modal[action].description}
                    confirmText={modal[action].confirmText}
                    variant={modal[action].variant}
                    open={!!action}
                    loading={form.processing}
                    onClose={close}
                    onConfirm={confirm}
                />
            )}
        </>
    );
}