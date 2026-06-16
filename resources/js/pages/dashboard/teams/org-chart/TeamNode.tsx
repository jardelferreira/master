import { Handle, Position } from 'reactflow';

type Props = {
    data: {
        name: string;
        members: {
            id: number
            name: string
        }[];
        leaders: {
            id: number;
            name: string;
        }[];
        childrenCount: number;
        membersCount: number;
    };
};

export default function TeamNode({
    data,
}: Props) {
    
    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
            />

            <div className="min-w-[260px] rounded-xl border bg-white shadow">
                <div className="border-b px-4 py-3 rounded-t-xl bg-blue-600">
                    <h3 className="font-bold text-center text-white uppercase">
                        {data.name}
                    </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 text-center">
                    <div>
                        <div className="text-lg font-bold">
                            {data.leaders.length}
                        </div>

                        <div className="text-xs">
                            Líderes
                        </div>
                    </div>

                    <div>
                        <div className="text-lg font-bold">
                            {data.membersCount}
                        </div>

                        <div className="text-xs">
                            Membros
                        </div>
                    </div>

                    <div>
                        <div className="text-lg font-bold">
                            {data.childrenCount}
                        </div>

                        <div className="text-xs">
                            Equipes
                        </div>
                    </div>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
            />
        </>
    );
}