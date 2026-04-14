import { Home, Users, ShieldCheck, UserLock, Building } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export type BaseNavItem = {
    label: string
    href: string
    icon: LucideIcon
    // controle de acesso (opcional)
    permission?: string
    canAny?: string[]
    canAll?: string[]
    active?: string | string[]

}

export type NavLink = BaseNavItem & {
    type: 'link'
    href: string
}

export type NavGroup = BaseNavItem & {
    type: 'group'
    children: NavLink[]
}

export type NavigationItem = NavLink | NavGroup

export const navigation: NavigationItem[] = [
    {
        type: 'link',
        label: 'Dashboard',
        href: '/home',
        icon: Home,
        active: 'dashboard'
    },

]