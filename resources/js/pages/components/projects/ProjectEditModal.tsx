import Modal from "@/pages/components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

// ── Helpers (REUTILIZADOS DO CREATE) ─────────────────

function generateInitials(name: string): string {
    const stopwords = new Set([
        'de','da','do','das','dos','e','em','a','o','as','os',
        'para','por','com','um','uma','no','na','nos','nas',
    ]);

    const words = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(w => w.replace(/[^a-zA-ZÀ-ÿ0-9]/g, ''));

    const significant = words.filter(
        w => w.length > 0 && !stopwords.has(w.toLowerCase())
    );

    const source = significant.length > 0 ? significant : words;

    const sigla = source
        .slice(0, 20)
        .map(w => w[0].toUpperCase())
        .join('');

    if (sigla.length >= 3) return sigla.slice(0, 20);

    const longest = source.reduce(
        (a, b) => (b.length > a.length ? b : a),
        source[0] ?? ''
    );

    const base = source.map(w => w[0].toUpperCase()).join('');

    const consonants = longest
        .slice(1)
        .replace(/[aeiouáéíóúàâêôãõäëïöü]/gi, '')
        .toUpperCase();

    return (base + consonants).slice(0, 3).padEnd(3, longest[1]?.toUpperCase() ?? 'X');
}

function getInitialsFontSize(len: number): string {
    if (len <= 6) return 'text-xl';
    if (len <= 12) return 'text-lg';
    if (len <= 16) return 'text-sm';
    if (len <= 20) return 'text-xs';
    return 'text-[10px]';
}

// ── Tipos ─────────────────────────────────────────

type Project = {
    id: number;
    name: string;
    description?: string;
    initials: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    project: Project;
};

// ── Component ─────────────────────────────────────

export default function ProjectEditModal({
    open,
    onClose,
    project,
}: Props) {

    const nameRef = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        isDirty,
    } = useForm({
        name: project.name,
        description: project.description || "",
        initials: project.initials || "",
    });

    const [manualInitials, setManualInitials] = useState(false);

    // 🔥 sync ao abrir
    useEffect(() => {
        if (open) {
            reset();
            setData({
                name: project.name,
                description: project.description || "",
                initials: project.initials || "",
            });

            setManualInitials(false);

            setTimeout(() => nameRef.current?.focus(), 80);
        }
    }, [project.id, open]);

    // 🔥 auto gerar iniciais (se não manual)
    function handleNameChange(value: string) {
        setData(prev => ({
            ...prev,
            name: value,
            initials: manualInitials
                ? prev.initials
                : (value.trim() ? generateInitials(value) : ''),
        }));
    }

    function handleInitialsChange(value: string) {
        const cleaned = value
            .replace(/[^a-zA-ZÀ-ÿ0-9\-_]/g, '')
            .toUpperCase()
            .slice(0, 20);

        setManualInitials(true);
        setData('initials', cleaned);
    }

    function handleClose() {
        reset();
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!isDirty) {
            onClose();
            return;
        }

        put(route('admin.projects.update', project.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    const initialsReady = data.initials.length >= 3;

    return (
        <Modal open={open} onClose={handleClose} title="Editar projeto">

            <form onSubmit={submit} className="space-y-5">

                {/* ── PREVIEW (IGUAL AO CREATE) ── */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">

                    <div
                        className={`
                        flex items-center justify-center
                        rounded-2xl text-white font-semibold
                        min-h-[64px] px-5 transition-all
                        ${getInitialsFontSize(data.initials.length)}
                        ${initialsReady
                            ? 'bg-blue-600 shadow-md shadow-blue-200'
                            : 'bg-slate-200 text-slate-400'}
                    `}
                    >
                        {data.initials || '···'}
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-800 break-words">
                            {data.name || <span className="text-slate-400">Nome do projeto</span>}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                            {initialsReady
                                ? 'Preview das iniciais · até 20 caracteres'
                                : 'As iniciais serão geradas automaticamente'}
                        </p>
                    </div>
                </div>

                {/* NOME */}
                <input
                    ref={nameRef}
                    value={data.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                />

                {/* INICIAIS */}
                <input
                    value={data.initials}
                    onChange={(e) => handleInitialsChange(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 font-mono"
                />

                {/* DESCRIÇÃO */}
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                />

                {/* ACTIONS */}
                <div className="flex justify-between items-center">

                    <span className={`text-xs ${isDirty ? 'text-amber-500' : 'text-transparent'}`}>
                        Alterações não salvas
                    </span>

                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm rounded-xl cursor-pointer bg-red-600 text-white hover:bg-red-700 font-medium transition inline-flex items-center gap-2"
                        onClick={handleClose}>Cancelar</button>
                        <button className="px-4 py-2 text-sm rounded-xl cursor-pointer bg-blue-600 text-white hover:bg-blue-700 font-medium transition inline-flex items-center gap-2"
                            type="submit"
                            disabled={!initialsReady || processing}
                        >
                            Salvar
                        </button>
                    </div>
                </div>

            </form>
        </Modal>
    );
}