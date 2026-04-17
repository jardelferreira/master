type Permission = {
    id: number;
    name: string;
};

type Role = {
    id: number;
    name: string;
    permissions: Permission[];
};

type Props = {
    permissions: Permission[];
    selected: string[];
    onChange: (values: string[]) => void;
};

export function PermissionsSelector({
    permissions,
    selected,
    onChange,
}: Props) {
    const toggle = (name: string) => {
        if (selected.includes(name)) {
            onChange(selected.filter((p) => p !== name));
        } else {
            onChange([...selected, name]);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {permissions.map((perm) => {
                const checked = selected.includes(perm.name);

                return (
                    <button
                        key={perm.id}
                        onClick={() => toggle(perm.name)}
                        className={`flex items-center justify-between px-3 py-2 rounded-md border text-sm transition ${
                            checked
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white hover:bg-gray-50'
                        }`}
                    >
                        <span>{perm.name}</span>

                        <div
                            className={`h-4 w-4 rounded-full ${
                                checked ? 'bg-white' : 'bg-gray-300'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}