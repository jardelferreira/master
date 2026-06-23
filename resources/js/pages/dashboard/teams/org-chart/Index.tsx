import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import {
    Download,
    FileImage,
    Printer,
    Users,
    X,
} from 'lucide-react';

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
} from 'reactflow';

import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

import 'reactflow/dist/style.css';

import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';

import TeamNode from './TeamNode';
import { buildNodes } from './buildNodes';
import { buildEdges } from './buildEdges';
import { getLayoutedElements } from './getLayoutedElements';

import type { OrgChartNode } from '@/types/org-chart';

type Props = {
    tree: OrgChartNode[];
};

export default function Index({
    tree,
}: Props) {
    const flowRef =
        useRef<HTMLDivElement>(null);

    const rawNodes =
        buildNodes(tree);

    const rawEdges =
        buildEdges(tree);

    const { nodes, edges } =
        getLayoutedElements(
            rawNodes,
            rawEdges,
        );

    const [
        selectedTeam,
        setSelectedTeam,
    ] = useState<OrgChartNode | null>(
        null,
    );

    useEffect(() => {
        const handler = (
            e: KeyboardEvent,
        ) => {
            if (
                e.key === 'Escape'
            ) {
                setSelectedTeam(
                    null,
                );
            }
        };

        window.addEventListener(
            'keydown',
            handler,
        );

        return () =>
            window.removeEventListener(
                'keydown',
                handler,
            );
    }, []);

    const exportPng =
        async () => {
            if (
                !flowRef.current
            )
                return;

            const image =
                await toPng(
                    flowRef.current,
                    {
                        backgroundColor:
                            '#ffffff',
                        pixelRatio: 2,
                    },
                );

            const link =
                document.createElement(
                    'a',
                );

            link.download =
                'organograma.png';

            link.href = image;

            link.click();
        };

    const exportPdf =
        async () => {
            if (
                !flowRef.current
            )
                return;

            const image =
                await toPng(
                    flowRef.current,
                    {
                        backgroundColor:
                            '#ffffff',
                        pixelRatio: 2,
                    },
                );

            const pdf =
                new jsPDF(
                    'landscape',
                    'mm',
                    'a3',
                );

            pdf.addImage(
                image,
                'PNG',
                10,
                10,
                400,
                250,
            );

            pdf.save(
                'organograma.pdf',
            );
        };

    const printChart =
        () => {
            window.print();
        };
    return (
        <DashboardLayout>
            <Head title="Organograma Corporativo" />

            <div className="flex h-full flex-col gap-4">

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Organograma Corporativo
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Estrutura organizacional
                            da empresa.
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <button
                            onClick={
                                exportPng
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                        >
                            <FileImage size={16} />
                            PNG
                        </button>

                        <button
                            onClick={
                                exportPdf
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                        >
                            <Download size={16} />
                            PDF
                        </button>

                        <button
                            onClick={
                                printChart
                            }
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                        >
                            <Printer size={16} />
                            Imprimir
                        </button>
                    </div>
                </div>

                <div
                    ref={flowRef}
                    className="h-[calc(100vh-180px)] overflow-hidden rounded-xl border bg-background"
                >
                    <ReactFlow
                        fitView
                        fitViewOptions={{
                            padding: 0.3,
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
                        <MiniMap
                            pannable
                            zoomable
                        />

                        <Controls />

                        <Background
                            gap={20}
                            size={1}
                        />
                    </ReactFlow>

                    {selectedTeam && (
                        <aside className="absolute right-0 top-0 z-50 h-full w-[420px] overflow-y-auto border-l bg-background shadow-2xl">

                            <div className="sticky top-0 flex items-center justify-between border-b bg-background p-4">
                                <div>
                                    <h2 className="font-semibold">
                                        {
                                            selectedTeam.name
                                        }
                                    </h2>

                                    <p className="text-xs text-muted-foreground">
                                        Informações da equipe
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setSelectedTeam(
                                            null,
                                        )
                                    }
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-3 p-4">

                                <div className="rounded-lg border p-3 text-center">
                                    <div className="text-xl font-bold">
                                        {
                                            selectedTeam.leaders
                                                ?.length ??
                                            0
                                        }
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Líderes
                                    </div>
                                </div>

                                <div className="rounded-lg border p-3 text-center">
                                    <div className="text-xl font-bold">
                                        {
                                            selectedTeam.members
                                                ?.length ??
                                            0
                                        }
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Membros
                                    </div>
                                </div>

                                <div className="rounded-lg border p-3 text-center">
                                    <div className="text-xl font-bold">
                                        {
                                            selectedTeam.childrenCount
                                        }
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Equipes
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 p-4">

                                <div>
                                    <h3 className="mb-3 font-semibold">
                                        Líderes
                                    </h3>

                                    <div className="space-y-2">
                                        {selectedTeam.leaders?.length
                                            ? selectedTeam.leaders.map(
                                                  (
                                                      leader,
                                                  ) => (
                                                      <div
                                                          key={
                                                              leader.id
                                                          }
                                                          className="rounded-lg border p-3"
                                                      >
                                                          ⭐{' '}
                                                          {
                                                              leader.name
                                                          }
                                                      </div>
                                                  ),
                                              )
                                            : (
                                                <div className="text-sm text-muted-foreground">
                                                    Nenhum líder cadastrado
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-3 font-semibold">
                                        Membros
                                    </h3>

                                    <div className="space-y-2">
                                        {selectedTeam.members?.length
                                            ? selectedTeam.members.map(
                                                  (
                                                      member,
                                                  ) => (
                                                      <div
                                                          key={
                                                              member.id
                                                          }
                                                          className="rounded-lg border p-3"
                                                      >
                                                          <Users
                                                              size={
                                                                  14
                                                              }
                                                              className="mr-2 inline"
                                                          />
                                                          {
                                                              member.name
                                                          }
                                                      </div>
                                                  ),
                                              )
                                            : (
                                                <div className="text-sm text-muted-foreground">
                                                    Nenhum membro cadastrado
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}