import HeaderNav from './HeaderNav';
import UserMenu from './UserMenu';
import HeaderActions from './HeaderActions';

export default function Header() {
    const navItems = [
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'Certificados', href: route('home') },
    ];

    return (
        <header className="flex h-16 items-center justify-between border-b border-base-200 bg-white px-4 sm:px-6">
            {/* <HeaderNav items={navItems} /> */}
            <div></div>
            <div className="flex items-center gap-3">
                <HeaderActions />
                <UserMenu />
            </div>
        </header>
    );
}
