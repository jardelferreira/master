import {
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';

interface DropdownProps {

    trigger: ReactNode;

    children: ReactNode;

    align?: 'left' | 'right';

    width?: string;

}

export function Dropdown({

    trigger,

    children,

    align = 'right',

    width = 'w-52',

}: DropdownProps) {

    const [open, setOpen] =
        useState(false);

    const ref =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        function handleClick(
            event: MouseEvent,
        ) {

            if (
                ref.current &&
                !ref.current.contains(
                    event.target as Node,
                )
            ) {

                setOpen(false);

            }

        }

        document.addEventListener(
            'mousedown',
            handleClick,
        );

        return () =>
            document.removeEventListener(
                'mousedown',
                handleClick,
            );

    }, []);

    return (

        <div
            ref={ref}
            className="relative"
        >

            <div
                onClick={() =>
                    setOpen(!open)
                }
            >

                {trigger}

            </div>

            {open && (

                <div
                    className={`absolute z-50 mt-2 ${width} rounded-xl border border-gray-200 bg-white shadow-lg ${
                        align === 'right'
                            ? 'right-0'
                            : 'left-0'
                    }`}
                >

                    {children}

                </div>

            )}

        </div>

    );

}