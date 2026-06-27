export type ModalProps = {
    open: boolean;
    title?: string;
    children: ReactNode;
    onClose: () => void;
};

export type ConfirmModalProps = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'destructive';
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
};
