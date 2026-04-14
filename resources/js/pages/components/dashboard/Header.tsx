import HeaderNav from './HeaderNav'
import UserMenu from './UserMenu'
import HeaderActions from './HeaderActions'

export default function Header() {
  const navItems = [
    { label: 'Dashboard', href: route('dashboard') },
    { label: 'Certificados', href: route('home') },
  ]

  return (
    <header className="h-16 bg-white border-b border-base-200  px-4 sm:px-6 flex items-center justify-between">
      {/* <HeaderNav items={navItems} /> */}
    <div></div>
      <div className="flex items-center gap-3">
        <HeaderActions />
        <UserMenu />
      </div>
    </header>
  )
}