import { navigation,NavigationItem } from '@/pages/config/SidebarDashboard'
import { NavItem } from '@/pages/components/dashboard/sidebar/NavItem'
import { NavGroup } from '@/pages/components/dashboard/sidebar/NavGroup'


import { useCanShowNavItem } from '@/utils/canShowNavItem'
import { useState } from 'react'

import { isActive } from '@/utils/navigationControls'

import { Menu } from 'lucide-react'

type SidebarProps = {
  navigation: NavigationItem[]
}

export function Sidebar({navigation}:SidebarProps) {
    const canShow = useCanShowNavItem()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={`bg-white border-r border-base-200
                        transition-all duration-300
                        ${collapsed ? 'w-20' : 'w-64'}
                    `}
        >
            <div className="h-16 flex items-center justify-between px-4 border-b border-base-200 cursor-pointer">
                {!collapsed && (
                    <span className="mx-auto font-semibold text-base-800">ProAction</span>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-base-600 hover:text-base-800 hover:bg-blue-200 cursor-pointer mx-2"
                    aria-label="Toggle sidebar"
                >
                    <Menu />
                </button>
            </div>

            <nav className="mt-4 space-y-1 px-2">
                {navigation.map((item, index) => {
                    if (item.type === 'link') {
                        if (!canShow(item)) return null

                        return (
                            <NavItem
                                key={index}
                                collapsed={collapsed}
                                label={item.label}
                                icon={item.icon}
                                href={item.href}
                                active={isActive(item.active)}
                            />
                        )
                    }

                    // group
                    const visibleChildren = item.children.filter(canShow)
                    if (visibleChildren.length === 0) return null

                    return (
                        <NavGroup
                            key={`${index}-${item.label}`}
                            group={{ ...item, children: visibleChildren }}
                            collapsed={collapsed}
                            canShow={canShow}
                        />
                    )
                })}
            </nav>
        </aside>
    )
}