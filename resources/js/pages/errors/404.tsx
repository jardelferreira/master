import ErrorLayout from '@/pages/layouts/ErrorLayout';
import { ErrorCard } from '@/components/ErrorCard';
import { router } from '@inertiajs/react';

export default function Error404() {
    return (
        <ErrorLayout>
            <ErrorCard
                code="404"
                title="Página não encontrada"
                description="O recurso que você procura não existe."
            >
                <button
                    onClick={() => router.visit('/')}
                    className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white"
                >
                    Voltar para o início
                </button>
            </ErrorCard>
        </ErrorLayout>
    );
}