'use client';

import { LucideIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

type NavItemProps = {
    collapsed: boolean;
    label: string;
    icon: LucideIcon;
    href: string;
    active?: boolean;
    onClick?: () => void
};

export function NavItem({
    collapsed,
    label,
    icon: Icon,
    href,
    active = false,
    onClick
}: NavItemProps) {
    return (
        <div className="relative group">
            <Link
                href={href}
                onClick={onClick}
                className={`mx-2 flex items-center gap-3 rounded-md px-2 py-2 text-sm font-semibold transition-all border ${
                    active
                        ? 'bg-blue-800 text-white border-blue-800'
                        : 'text-blue-700 border-transparent hover:bg-blue-100'
                }`}
            >
                <Icon
                    className={`h-5 w-5 ${
                        active ? 'text-white' : 'text-blue-800'
                    }`}
                />

                {!collapsed && <span>{label}</span>}
            </Link>

            {/* 🔥 Tooltip sem gap real */}
            {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2 translate-x-1 opacity-0 scale-95 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-100">
                    
                    {/* área “ponte” invisível */}
                    <div className="pl-2">
                        <div className="whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                            {label}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}