import { Link } from '@inertiajs/react'
import { useState } from 'react'

type NavItem = {
  label: string
  href: string
}

type Props = {
  items: NavItem[]
}

export default function MobileNav({ items }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden relative">
      {/* Botão hamburger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="p-2 rounded-md hover:bg-base-100"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-base-200 rounded-md shadow-lg z-50">
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-base-700 hover:bg-base-100"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}