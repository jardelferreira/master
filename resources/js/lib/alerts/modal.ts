import { Alert } from '../alert';
import { AlertStatus } from '@/types/alert';
import { ICON_MAP, TITLE_MAP } from '@/types/alert';

export function showAlert(
    status: AlertStatus,
    message: string,
    title?: string,
) {
    return Alert.fire({
        icon: ICON_MAP[status],
        title: title ?? TITLE_MAP[status],
        text: message,
        timer: 2000,
    });
}
