import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    X,
} from 'lucide-react';

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
} from 'reactflow';

import 'reactflow/dist/style.css';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';

import TeamNode from './TeamNode';

import { buildNodes } from './buildNodes';

import {
    buildEdges,
} from './buildEdges';

import type {
    OrgChartNode,
} from '@/types/org-chart';

type Props = {
    tree: OrgChartNode[];
};

export default function Index({
    tree,
}: Props) {
    const nodes =
        buildNodes(tree);

    const edges =
        buildEdges(tree);

    const [
        selectedTeam,
        setSelectedTeam,
    ] = useState<OrgChartNode | null>(null);

    return (
        <DashboardLayout>
            <Head title="Organograma Corporativo" />

            <div className="h-[calc(100vh-80px)]">
                <ReactFlow
                    fitView
                    fitViewOptions={{
                        padding: 0.2,
                    }}
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={{
                        team: TeamNode,
                    }}
                    onNodeClick={(
                        _,
                        node,
                    ) =>
                        setSelectedTeam(
                            node.data,
                        )
                    }
                >
                    {selectedTeam && (
                        <aside className="absolute right-0 top-0 z-50 h-full w-96 border-l bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b p-4">
                                <h2 className="font-semibold">
                                    {selectedTeam.name}
                                </h2>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTeam(
                                            null,
                                        )
                                    }
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-6 p-4">
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold">
                                        Líderes
                                    </h3>

                                    {selectedTeam
                                        .leaders
                                        ?.length ? (
                                        selectedTeam.leaders.map(
                                            (
                                                leader,
                                            ) => (
                                                <div
                                                    key={
                                                        leader.id
                                                    }
                                                >
                                                    ⭐{' '}
                                                    {
                                                        leader.name
                                                    }
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            Nenhum
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-semibold">
                                        Membros
                                    </h3>

                                    {selectedTeam
                                        .members
                                        ?.length ? (
                                        selectedTeam.members.map(
                                            (
                                                member,
                                            ) => (
                                                <div
                                                    key={
                                                        member.id
                                                    }
                                                >
                                                    👤{' '}
                                                    {
                                                        member.name
                                                    }
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            Nenhum
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-semibold">
                                        Sub-equipes
                                    </h3>

                                    <div>
                                        {
                                            selectedTeam
                                                .children_count
                                        }
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}
                    <MiniMap />

                    <Controls />

                    <Background />
                </ReactFlow>
            </div>
        </DashboardLayout>
    );
}