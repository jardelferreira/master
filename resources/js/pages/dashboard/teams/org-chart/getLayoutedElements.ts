import dagre from 'dagre';

import {
    Edge,
    Node,
} from 'reactflow';

const dagreGraph =
    new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(
    () => ({})
);

const nodeWidth = 380;
const nodeHeight = 140;

export function getLayoutedElements(
    nodes: Node[],
    edges: Edge[],
) {
    dagreGraph.setGraph({
        rankdir: 'TB',
        ranksep: 220,
        nodesep: 220,
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(
            node.id,
            {
                width: nodeWidth,
                height: nodeHeight,
            },
        );
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(
            edge.source,
            edge.target,
        );
    });

    dagre.layout(
        dagreGraph,
    );

    nodes.forEach((node) => {
        const position =
            dagreGraph.node(
                node.id,
            );

        node.position = {
            x:
                position.x -
                nodeWidth / 2,

            y:
                position.y -
                nodeHeight / 2,
        };
    });

    return {
        nodes,
        edges,
    };
}