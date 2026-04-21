import { useForm } from '@inertiajs/react';
import Modal from '@/pages/components/Modal';
import { useEffect, useRef } from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
};

type ProjectForm = {
    name: string;
    description: string;
    initials: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Gera iniciais coerentes com o nome do projeto (mínimo 3, máximo 20 chars).
// Caracteres permitidos: letras, números, hífen e underscore.
//
// Estratégia em ordem de prioridade:
//  1. Sigla das palavras significativas (removendo stopwords).
//     Ex: "Sistema de Gestão Hidráulica" → "SGH"
//  2. Se a sigla tiver menos de 3 letras, expande com letras internas
//     da primeira palavra mais longa.
//     Ex: "Gestão" → "GES"
//  3. Nunca ultrapassa 20 caracteres.
// ─────────────────────────────────────────────────────────────────────────────
function generateInitials(name: string): string {
    const stopwords = new Set([
        'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o', 'as', 'os',
        'para', 'por', 'com', 'um', 'uma', 'no', 'na', 'nos', 'nas',
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

    // Sigla das iniciais (até 20 palavras)
    const sigla = source
        .slice(0, 20)
        .map(w => w[0].toUpperCase())
        .join('');

    if (sigla.length >= 3) return sigla.slice(0, 20);

    // Com menos de 3 palavras, expande com letras internas da palavra mais longa
    const longest = source.reduce(
        (a, b) => (b.length > a.length ? b : a),
        source[0] ?? ''
    );

    const base = source.map(w => w[0].toUpperCase()).join('');

    const consonants = longest
        .slice(1)
        .replace(/[aeiouáéíóúàâêôãõäëïöü]/gi, '')
        .toUpperCase();

    const result = (base + consonants).slice(0, 3).padEnd(3, longest[1]?.toUpperCase() ?? 'X');

    return result.slice(0, 3);
}

// Tamanho de fonte adaptativo para o badge de iniciais
function getInitialsFontSize(len: number): string {
    if (len <= 6) return 'text-xl';
    if (len <= 12) return 'text-lg';
    if (len <= 16) return 'text-sm';
    if (len <= 20) return 'text-xs';
    return 'text-[10px]';
}

export default function CreateProjectModal({ open, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } =
        useForm<ProjectForm>({
            name: '',
            description: '',
            initials: '',
        });

    const nameRef = useRef<HTMLInputElement>(null);

    // Foca o campo nome ao abrir
    useEffect(() => {
        if (open) setTimeout(() => nameRef.current?.focus(), 80);
    }, [open]);

    // Atualiza iniciais em tempo real conforme o nome é digitado
    function handleNameChange(value: string) {
        setData(prev => ({
            ...prev,
            name: value,
            initials: value.trim().length > 0 ? generateInitials(value) : '',
        }));
    }

    function handleInitialsChange(value: string) {
        // Permite letras (incluindo acentuadas), números, hífen e underscore
        const cleaned = value
            .replace(/[^a-zA-ZÀ-ÿ0-9\-_]/g, '')
            .toUpperCase()
            .slice(0, 20);
        setData('initials', cleaned);
    }

    function handleClose() {
        reset();
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.projects.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    const initialsReady = data.initials.length >= 3;

    return (
        <Modal open={open} onClose={handleClose} title="Novo projeto">
            <form onSubmit={submit} className="space-y-5">

                {/* ── PREVIEW DAS INICIAIS ── */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">

                    {/* PREVIEW EXPANSIVO */}
                    <div
                        className={`
            flex items-center justify-center
            rounded-2xl
            text-white font-semibold tracking-wide select-none
            transition-all duration-300

            min-h-[64px] px-5

            ${getInitialsFontSize(data.initials.length)}

            ${initialsReady
                                ? 'bg-blue-600 shadow-md shadow-blue-200'
                                : 'bg-slate-200 text-slate-400'}
        `}
                    >
                        <span className="whitespace-nowrap text-center leading-tight">
                            {data.initials || '···'}
                        </span>
                    </div>

                    {/* NOME ABAIXO */}
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

                {/* ── NOME ── */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Nome do projeto
                    </label>
                    <input
                        ref={nameRef}
                        type="text"
                        value={data.name}
                        onChange={e => handleNameChange(e.target.value)}
                        className={`
                            w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800
                            placeholder:text-slate-400
                            focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400
                            transition
                            ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}
                        `}
                        placeholder="Ex: Sistema de Gestão Hidráulica"
                        disabled={processing}
                        maxLength={80}
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* ── INICIAIS (editável) ── */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Iniciais
                        </label>
                        <span className="text-xs text-slate-400">
                            {data.initials.length}/20 · mínimo 3
                        </span>
                    </div>
                    <input
                        type="text"
                        value={data.initials}
                        onChange={e => handleInitialsChange(e.target.value)}
                        className={`
                            w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono font-semibold
                            uppercase tracking-widest text-blue-700
                            placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal
                            focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400
                            transition
                            ${errors.initials ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-blue-50/40'}
                        `}
                        placeholder="SGH"
                        maxLength={20}
                        disabled={processing}
                    />
                    {errors.initials && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.initials}</p>
                    )}
                </div>

                {/* ── DESCRIÇÃO ── */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Descrição
                        <span className="ml-1 text-slate-400 font-normal">(opcional)</span>
                    </label>
                    <textarea
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        rows={3}
                        className={`
                            w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800
                            placeholder:text-slate-400 resize-none
                            focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400
                            transition
                            ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}
                        `}
                        placeholder="Descreva brevemente o objetivo do projeto…"
                        disabled={processing}
                        maxLength={300}
                    />
                    <div className="flex justify-between items-start mt-1">
                        {errors.description
                            ? <p className="text-xs text-red-600">{errors.description}</p>
                            : <span />}
                        <span className="text-xs text-slate-400 tabular-nums">
                            {data.description.length}/300
                        </span>
                    </div>
                </div>

                {/* ── ACTIONS ── */}
                <div className="flex justify-end gap-2 pt-1">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={processing}
                        className="rounded-xl border border-slate-200 px-4 py-2.5  text-sm text-white hover:cursor-pointer disabled:opacity-50 transition bg-red-400"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={processing || !initialsReady || !data.name.trim()}
                        className="
                            inline-flex items-center gap-2 rounded-xl
                            bg-blue-600 hover:bg-blue-700 hover:cursor-pointer
                            px-5 py-2.5 text-sm font-medium text-white
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition
                        "
                    >
                        {processing && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        Criar projeto
                    </button>
                </div>

            </form>
        </Modal>
    );
}