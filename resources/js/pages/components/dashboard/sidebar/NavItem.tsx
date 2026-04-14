import { LucideIcon } from "lucide-react"
import { Link } from "@inertiajs/react"

type NavItemProps = {
    collapsed: boolean
    label: string
    icon: LucideIcon,
    href: string,
    active?: boolean
}

export function NavItem({ collapsed, label, icon: Icon, href, active = false }: NavItemProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-base-600 hover:bg-base-100 mx-2
            ${active
                    ? 'bg-core-400 text-core-900 font-medium'
                    : 'text-base-600 hover:bg-base-100'
                }
        `}
        >
            <Icon className={`h-5 w-5 text-base-500
                ${active ? 'text-core-600' : 'text-base-500'
                }
                `} />
            {!collapsed && <span>{label}</span>}
        </Link>
    )
}