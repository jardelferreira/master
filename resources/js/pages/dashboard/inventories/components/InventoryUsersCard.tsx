import {
    CheckCircle2,
    Shield,
    User,
    Users,
} from 'lucide-react';

import Card from '@/components/shared/card/Card';
import CardBody from '@/components/shared/card/CardBody';
import CardHeader from '@/components/shared/card/CardHeader';

interface SimpleUser {
    id: number;
    name: string | null;
}

interface Props {
    inventory: {
        creator: SimpleUser | null;
        approver: SimpleUser | null;
        users: SimpleUser[];
    };
}

function UserCard({
    title,
    user,
    icon,
}: {
    title: string;
    user: SimpleUser | null;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-base-200 p-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-core-50 text-core-600">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs uppercase tracking-wide text-base-500">
                    {title}
                </p>

                <p className="truncate font-semibold text-base-900">
                    {user?.name ?? '-'}
                </p>

            </div>

        </div>
    );
}

export default function InventoryUsersCard({
    inventory,
}: Props) {
    return (
        <Card>

            <CardHeader>

                <h2 className="text-lg font-semibold">
                    Responsáveis
                </h2>

            </CardHeader>

            <CardBody className="space-y-5">

                <UserCard
                    title="Criado por"
                    user={inventory.creator}
                    icon={<Shield size={18} />}
                />

                <div>

                    <div className="mb-3 flex items-center gap-2">

                        <Users
                            size={16}
                            className="text-core-600"
                        />

                        <h3 className="font-medium">
                            Operadores
                        </h3>

                    </div>

                    <div className="space-y-3">

                        {inventory.users.length > 0 ? (
                            inventory.users.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 rounded-lg border border-base-200 px-4 py-3"
                                >

                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-base-100 font-semibold">
                                        {user.name
                                            ?.split(' ')
                                            .map(v => v[0])
                                            .slice(0, 2)
                                            .join('')}
                                    </div>

                                    <div>

                                        <div className="font-medium">
                                            {user.name}
                                        </div>

                                        <div className="text-xs text-base-500">
                                            Operador do inventário
                                        </div>

                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="rounded-lg border border-dashed border-base-200 p-4 text-center text-sm text-base-500">
                                Nenhum operador vinculado.
                            </div>
                        )}

                    </div>

                </div>

                <UserCard
                    title="Aprovado por"
                    user={inventory.approver}
                    icon={<CheckCircle2 size={18} />}
                />

            </CardBody>

        </Card>
    );
}