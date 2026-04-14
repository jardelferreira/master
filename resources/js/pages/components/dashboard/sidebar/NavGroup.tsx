import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { NavItem } from '@/pages/components/dashboard/sidebar/NavItem'
import { NavigationItem, NavGroup as NavGroupType } from '@/pages/config/SidebarDashboard'

type Props = {
    group: NavGroupType
    collapsed: boolean
    canShow: (item: NavigationItem) => boolean
}

export function NavGroup({ group, collapsed, canShow }: Props) {
    const hasActiveChild = group.children.some(child =>
        child.active
            ? Array.isArray(child.active)
                ? child.active.some(name => route().current(name))
                : route().current(child.active)
            : false
    )

    const [open, setOpen] = useState(hasActiveChild)

    useEffect(() => {
        if (hasActiveChild) setOpen(true)
    }, [hasActiveChild])

    return (
        <div className="space-y-1">
            {/* Grupo */}
            <button
                onClick={() => setOpen(v => !v)}
                className={`
          w-full flex items-center justify-between px-3 py-2 rounded-md
          ${hasActiveChild ? 'bg-core-50 text-core-700' : 'text-base-600 hover:bg-base-100'}
        `}
            >
                <div className="flex items-center gap-3">
                    <group.icon className="h-5 w-5" />
                    {!collapsed && <span>{group.label}</span>}
                </div>

                {!collapsed && (
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''
                            }`}
                    />
                )}
            </button>

            {/* Submenu */}
            {open && !collapsed && (
                <div className="ml-6 space-y-1">
                    {group.children
                        .filter(canShow)
                        .map((item, index) => (
                            <NavItem
                                key={index}
                                collapsed={false}
                                label={item.label}
                                icon={item.icon}
                                href={item.href}
                                active={
                                    item.active
                                        ? Array.isArray(item.active)
                                            ? item.active.some(name => route().current(name))
                                            : route().current(item.active)
                                        : false
                                }
                            />
                        ))}
                </div>
            )}
        </div>
    )
}