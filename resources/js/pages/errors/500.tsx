import ErrorLayout from '@/pages/layouts/ErrorLayout';
import { ErrorCard } from '@/components/ErrorCard';

export default function Error500() {
    return (
        <ErrorLayout>
            <ErrorCard
                code="500"
                title="Erro interno"
                description="Algo deu errado. Tente novamente mais tarde."
            />
        </ErrorLayout>
    );
}