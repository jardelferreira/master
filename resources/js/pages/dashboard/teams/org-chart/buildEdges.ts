import type {
    Edge,
} from 'reactflow';

import type {
    OrgChartNode,
} from '@/types/org-chart';

export function buildEdges(
    tree: OrgChartNode[],
): Edge[] {
    const edges: Edge[] = [];

    function walk(
        nodes: OrgChartNode[],
    ) {
        nodes.forEach(
            (node) => {
                node.children.forEach(
                    (
                        child,
                    ) => {
                        edges.push({
                            id: `${node.id}-${child.id}`,

                            source:
                                String(
                                    node.id,
                                ),

                            target:
                                String(
                                    child.id,
                                ),
                        });
                    },
                );

                walk(
                    node.children,
                );
            },
        );
    }

    walk(tree);

    return edges;
}