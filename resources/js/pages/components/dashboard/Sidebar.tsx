import { NavigationItem } from '@/pages/config/SidebarDashboard';
import { NavItem } from '@/pages/components/dashboard/sidebar/NavItem';
import { NavGroup } from '@/pages/components/dashboard/sidebar/NavGroup';

import { useCanShowNavItem } from '@/utils/canShowNavItem';
import { useState } from 'react';

import { isActive } from '@/utils/navigationControls';

import { Menu } from 'lucide-react';
import { usePage } from '@inertiajs/react';

type SidebarProps = {
    navigation: NavigationItem[];
};

export function Sidebar({ navigation }: SidebarProps) {
    const canShow = useCanShowNavItem();
    const [collapsed, setCollapsed] = useState(false);
    const { app_name } = usePage().props as { app_name?: string };

    return (
        <aside
            className={`border-r border-base-200 bg-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} `}
        >
            <div className="flex h-16 cursor-pointer items-center justify-between border-b border-base-200 px-4">
                {!collapsed && (
                    <span className="mx-auto font-bold text-blue-700 text-lg">
                        {app_name}
                    </span>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="mx-2 cursor-pointer text-base-600 hover:bg-blue-200 hover:text-base-800"
                    aria-label="Toggle sidebar"
                >
                    <Menu />
                </button>
            </div>

            <nav className="mt-4 space-y-1 px-2">
                {navigation.map((item, index) => {
                    if (item.type === 'link') {
                        if (!canShow(item)) return null;

                        return (
                            <NavItem
                                key={`${index}-${item.href}`}
                                collapsed={collapsed}
                                label={item.label}
                                icon={item.icon}
                                href={item.href}
                                active={isActive(item.active)}
                            />
                        );
                    }

                    // group
                    const visibleChildren = item.children.filter(canShow);
                    if (visibleChildren.length === 0) return null;

                    return (
                        <NavGroup
                            key={`${index}-${item.label}`}
                            group={{ ...item, children: visibleChildren }}
                            collapsed={collapsed}
                            canShow={canShow}
                        />
                    );
                })}
            </nav>
        </aside>
    );
}
