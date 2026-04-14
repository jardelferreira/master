import { Link } from '@inertiajs/react'
import { NavItemProps } from '@/types/navigation'

export default function DesktopNav({ items }: NavItemProps) {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-base-600 hover:text-base-800 transition"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}