import { LucideIcon } from "lucide-react";

type NavItemProps = {
    collapsed: boolean;
    label: string;
    icon: LucideIcon;
    href: string;
    active?: boolean;
};
export type NavItemProps = {
    items: NavItem[];
};
