import { router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

export default function StockConsultaHeader() {
    const { auth } = usePage().props as any;

    return (
        <header className="flex h-16 items-center justify-between border-b border-base-200 bg-white px-6">

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                        {auth.user?.name}
                    </p>

                    <p className="text-xs text-slate-500">
                        Warehouse
                    </p>
                </div>

                <button
                    onClick={() =>
                        router.post(
                            route('stock.logout'),
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                >
                    <LogOut size={16} />
                    Sair
                </button>
            </div>
        </header>
    );
}