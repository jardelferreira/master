import { Bell } from 'lucide-react';
import Dropdown from './Dropdown';

type Props = {
    count?: number;
};

export default function Notifications({ count = 0 }: Props) {
    return (
        <Dropdown
            align="right"
            trigger={
                <div className="relative cursor-pointer rounded-md p-2 hover:bg-base-100 dark:hover:bg-base-800">
                    <Bell className="h-6 w-6" />

                    {count > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                            {count}
                        </span>
                    )}
                </div>
            }
        >
            <div className="w-64 py-2 text-sm text-base-600">
                <div className="px-4 py-2 font-medium text-base-800">
                    Notificações
                </div>

                <div className="px-4 py-6 text-center text-base-500">
                    Nenhuma notificação no momento
                </div>
            </div>
        </Dropdown>
    );
}
