import { SweetAlertIcon } from 'sweetalert2';

export type AlertStatus = 'success' | 'error' | 'warning' | 'info';

export type AlertOptions = {
    title?: string;
    message: string;
    icon?: SweetAlertIcon;
};

export type SweetAlertFlashPayload = {
    success: boolean;
    status: AlertStatus;
    message: string;
    type?: 'toast' | 'modal';
};

export const ICON_MAP: Record<AlertStatus, SweetAlertIcon> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
};

export const TITLE_MAP: Record<AlertStatus, string> = {
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Atenção',
    info: 'Aviso',
};
