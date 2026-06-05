import type {
    Node,
} from 'reactflow';

import type {
    OrgChartNode,
} from '@/types/org-chart';

export function buildNodes(
    tree: OrgChartNode[],
): Node[] {
    const nodes: Node[] = [];

    function walk(
        items: OrgChartNode[],
        level = 0,
        parentX = 0,
    ) {
        items.forEach(
            (
                item,
                index,
            ) => {
                const x =
                    parentX +
                    index * 350;

                const y =
                    level * 220;

                nodes.push({
                    id: String(item.id),

                    type: 'team',

                    position: {
                        x,
                        y,
                    },

                    data: {
                        name: item.name,

                        leaders:
                            item.leaders ?? [],

                        members:
                            item.members ?? [],
                        membersCount:
                            item.members_count,

                        childrenCount:
                            item.children_count,
                    },

                });

                walk(
                    item.children,
                    level + 1,
                    x,
                );
            },
        );
    }

    walk(tree);

    return nodes;
}