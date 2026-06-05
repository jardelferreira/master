import { useState } from 'react';

import {
    ChevronDown,
    ChevronRight,
    FolderTree,
    User,
    Star,
} from 'lucide-react';

export type TeamTreeNodeType = {
    id: number;

    name: string;

    members: {
        id: number;
        name: string;
        role: string;
    }[];

    children: TeamTreeNodeType[];
};

type Props = {
    node: TeamTreeNodeType;

    level?: number;
};

export default function TeamTreeNode({
    node,
    level = 0,
}: Props) {
    const [expanded, setExpanded] =
        useState(true);

    const hasChildren =
        node.children.length > 0;

    const totalMembers =
        node.members.length;

    return (
        <div>
            <div
                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-base-100"
                style={{
                    paddingLeft: `${
                        level * 24
                    }px`,
                }}
            >
                {hasChildren ? (
                    <button
                        type="button"
                        onClick={() =>
                            setExpanded(
                                !expanded,
                            )
                        }
                        className="rounded p-1 hover:bg-base-200"
                    >
                        {expanded ? (
                            <ChevronDown
                                size={16}
                            />
                        ) : (
                            <ChevronRight
                                size={16}
                            />
                        )}
                    </button>
                ) : (
                    <div className="w-6" />
                )}

                <FolderTree
                    size={18}
                    className="text-core-600"
                />

                <span className="font-medium">
                    {node.name}
                </span>

                <span className="rounded-full bg-base-100 px-2 py-0.5 text-xs text-base-500">
                    {totalMembers}{' '}
                    membro
                    {totalMembers !==
                    1
                        ? 's'
                        : ''}
                </span>

                {node.children.length >
                    0 && (
                    <span className="rounded-full bg-base-100 px-2 py-0.5 text-xs text-base-500">
                        {
                            node.children
                                .length
                        }{' '}
                        equipe
                        {node.children
                            .length >
                        1
                            ? 's'
                            : ''}
                    </span>
                )}
            </div>

            {expanded && (
                <>
                    {node.members.map(
                        (
                            member,
                        ) => (
                            <div
                                key={
                                    member.id
                                }
                                className="flex items-center gap-2 py-1 text-sm"
                                style={{
                                    paddingLeft: `${
                                        (level +
                                            1) *
                                        24
                                    }px`,
                                }}
                            >
                                <User
                                    size={
                                        15
                                    }
                                    className="text-base-500"
                                />

                                <span>
                                    {
                                        member.name
                                    }
                                </span>

                                {member.role ===
                                    'leader' && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                                        <Star
                                            size={
                                                12
                                            }
                                        />
                                        Líder
                                    </span>
                                )}
                            </div>
                        ),
                    )}

                    {node.children.map(
                        (
                            child,
                        ) => (
                            <TeamTreeNode
                                key={
                                    child.id
                                }
                                node={
                                    child
                                }
                                level={
                                    level +
                                    1
                                }
                            />
                        ),
                    )}
                </>
            )}
        </div>
    );
}