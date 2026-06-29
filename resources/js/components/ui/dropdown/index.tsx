import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

interface DropdownContextValue {
    close: () => void;
}

const DropdownContext =
    createContext<DropdownContextValue | null>(null);

interface DropdownProps {

    trigger: ReactNode;

    children: ReactNode;

    align?: 'left' | 'right';

    width?: string;

}

function Root({

    trigger,

    children,

    align = 'right',

    width = 'w-56',

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

        <DropdownContext.Provider
            value={{
                close: () => setOpen(false),
            }}
        >

            <div
                ref={ref}
                className="relative"
            >

                <div
                    onClick={() =>
                        setOpen(
                            current => !current,
                        )
                    }
                >
                    {trigger}
                </div>

                {open && (

                    <div
                        className={`absolute z-50 mt-2 ${width} rounded-xl border border-gray-200 bg-white py-1 shadow-lg ${
                            align === 'right'
                                ? 'right-0'
                                : 'left-0'
                        }`}
                    >

                        {children}

                    </div>

                )}

            </div>

        </DropdownContext.Provider>

    );

}

interface ItemProps {

    children: ReactNode;

    icon?: ReactNode;

    disabled?: boolean;

    onClick?: () => void;

}

function Item({

    children,

    icon,

    disabled,

    onClick,

}: ItemProps) {

    const context =
        useContext(DropdownContext);

    return (

        <button
            type="button"
            disabled={disabled}
            onClick={() => {

                onClick?.();

                context?.close();

            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
        >

            {icon}

            {children}

        </button>

    );

}

interface DividerProps {}

function Divider({}: DividerProps) {

    return (

        <div className="my-1 border-t border-gray-200" />

    );

}

export const Dropdown = {

    Root,

    Item,

    Divider,

};