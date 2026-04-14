import { NavigationItem } from '@/pages/config/SidebarDashboard'
import { usePermission } from '@/hooks/usePermission'

export function useCanShowNavItem() {
  const { can, canAny, canAll } = usePermission()

  return (item: NavigationItem): boolean => {
    if (item.permission && !can(item.permission)) return false
    if (item.canAny && !canAny(item.canAny)) return false
    if (item.canAll && !canAll(item.canAll)) return false
    return true
  }
}