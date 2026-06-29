import { ReactNode } from 'react';

interface Props {

    children: ReactNode;

    icon?: ReactNode;

    onClick?: () => void;

    disabled?: boolean;

}

export function DropdownItem({

    children,

    icon,

    onClick,

    disabled,

}: Props) {

    return (

        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
        >

            {icon}

            {children}

        </button>

    );

}