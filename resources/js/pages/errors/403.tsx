import ErrorLayout from '@/pages/layouts/ErrorLayout';
import { ErrorCard } from '@/components/ErrorCard';

export default function Error403() {
    return (
        <ErrorLayout>
            <ErrorCard
                code="403"
                title="Acesso negado"
                description="Você não tem permissão para acessar esta página."
            />
        </ErrorLayout>
    );
}