import { NavItem } from '@/pages/components/dashboard/sidebar/NavItem';
import { NavGroup } from '@/pages/components/dashboard/sidebar/NavGroup';
import { isActive } from '@/utils/navigationControls';

type Props = {
    item: any;
    collapsed: boolean;
    canShow: (item: any) => boolean;
};

export function NavNode({
    item,
    collapsed,
    canShow,
}: Props) {
    if (item.type === 'link') {
        if (!canShow(item)) {
            return null;
        }

        return (
            <NavItem
                collapsed={collapsed}
                label={item.label}
                icon={item.icon}
                href={item.href}
                active={isActive(item.active)}
                onClick={item.onClick}
            />
        );
    }

    const visibleChildren = item.children.filter(canShow);

    if (visibleChildren.length === 0) {
        return null;
    }

    return (
        <NavGroup
            group={{
                ...item,
                children: visibleChildren,
            }}
            collapsed={collapsed}
            canShow={canShow}
        />
    );
}