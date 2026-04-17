import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

type NavItem = {
    label: string;
    href: string;
};

type Props = {
    items: NavItem[];
};

export default function HeaderNav({ items }: Props) {
    return (
        <div className="flex items-center gap-2">
            <MobileNav items={items} />
            <DesktopNav items={items} />
        </div>
    );
}
