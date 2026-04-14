import { Link, usePage } from '@inertiajs/react'
import Dropdown from '../Dropdown'
import Avatar from '../Avatar'
import { PageProps } from '@/types/inertia'

export default function UserMenu() {
  const { auth } = usePage<PageProps>().props

  return (
    <Dropdown
      align="right"
      trigger={
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar
            name={auth.user.name}
            imageUrl={auth.user.img_url}
            size={36}
          />
          <span className="hidden sm:block text-sm text-base-700">
            {auth.user.name}
          </span>
        </div>
      }
    >
      <div className="py-2 text-sm">
        <Link
          href="#"
          className="block px-4 py-2 text-base-600 hover:bg-base-100"
        >
          Meu perfil
        </Link>

        <Link
          href={route('logout')}
          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
        >
          Sair
        </Link>
      </div>
    </Dropdown>
  )
}