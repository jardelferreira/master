import { Head } from '@inertiajs/react';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';

import {PageContainer} from '@/pages/components/PageContainer';
import {PageCard} from '@/pages/components/PageCard';

import TeamTreeNode, {
    TeamTreeNodeType,
} from '@/pages/components/teams/tree/TeamTreeNode';

type Props = {
    tree: TeamTreeNodeType[];
};

export default function Index({
    tree,
}: Props) {
    return (
        <DashboardLayout>
            <Head title="Organograma" />

            <PageContainer>
                <PageCard>
                     <div className="mb-4">
                        <h3 className="text-lg font-medium">Organograma</h3>
                        <p className="text-sm text-muted-foreground">Visualização hierárquica das equipes e colaboradores.</p>
                    </div>
                    <div className="space-y-2">
                        {tree.map(
                            (
                                node,
                            ) => (
                                <TeamTreeNode
                                    key={
                                        node.id
                                    }
                                    node={
                                        node
                                    }
                                />
                            ),
                        )}
                    </div>
                </PageCard>
            </PageContainer>
        </DashboardLayout>
    );
}