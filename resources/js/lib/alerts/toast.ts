import { Alert } from '../alert'
import { AlertStatus } from '@/types/alert'
import { SweetAlertIcon } from 'sweetalert2'

const ICON_MAP: Record<AlertStatus, SweetAlertIcon> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

export function showToast(
  status: AlertStatus,
  message: string
) {
  return Alert.fire({
    toast: true,
    position: 'top-end',
    icon: ICON_MAP[status],
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}