import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { showToast } from '@/lib/alerts/toast'
import { SweetAlertFlashPayload } from '@/types/alert'


export default function FlashMessage() {
  const { flash } = usePage<{ flash?: SweetAlertFlashPayload }>().props

  useEffect(() => {
    if (!flash) return

    if (flash.type === 'modal') {
      import('@/lib/alerts/modal').then(({ showAlert }) =>
        showAlert(flash.status, flash.message)
      )
    } else {
      showToast(flash.status, flash.message)
    }
  }, [flash?.status, flash?.message])

  return null
}