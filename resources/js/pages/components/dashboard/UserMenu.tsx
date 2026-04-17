import { Link, usePage } from '@inertiajs/react';
import Dropdown from '../Dropdown';
import Avatar from '../Avatar';
import { PageProps } from '@/types/inertia';

import { router } from '@inertiajs/react';

export default function UserMenu() {
    const { auth } = usePage<PageProps>().props;

    return (
        <Dropdown
            align="right"
            trigger={
                <div className="flex cursor-pointer items-center gap-2">
                    <Avatar
                        name={auth.user.name}
                        imageUrl={auth.user.img_url}
                        size={36}
                    />
                    <span className="hidden text-sm text-base-700 sm:block">
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
                    onClick={() => router.post(route('logout'))}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                    Sair
                </Link>
            </div>
        </Dropdown>
    );
}
