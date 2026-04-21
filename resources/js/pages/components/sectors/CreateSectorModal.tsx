import { useForm } from '@inertiajs/react';
import Modal from '@/pages/components/Modal';
import { useEffect, useRef } from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
    projectId: number;
};

type SectorForm = {
    name: string;
    description: string;
    project_id: number;
};

export default function CreateSectorModal({ open, onClose, projectId }: Props) {
    const nameRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } =
        useForm<SectorForm>({
            name: '',
            description: '',
            project_id: projectId,
        });

    // Atualiza project_id se mudar
    useEffect(() => {
        setData('project_id', projectId);
    }, [projectId]);

    // foco no input
    useEffect(() => {
        if (open) setTimeout(() => nameRef.current?.focus(), 80);
    }, [open]);

    function handleClose() {
        reset();
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(route('admin.projects.sectors.store',projectId), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    return (
        <Modal open={open} onClose={handleClose} title="Novo setor">
            <form onSubmit={submit} className="space-y-5">

                {/* NOME */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nome do setor
                    </label>

                    <input
                        ref={nameRef}
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-500' : 'border-slate-200'
                        }`}
                        placeholder="Ex: Elétrica, Hidráulica..."
                        disabled={processing}
                    />

                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* DESCRIÇÃO */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Descrição
                    </label>

                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        className={`w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                            errors.description ? 'border-red-500' : 'border-slate-200'
                        }`}
                        placeholder="Descreva o setor..."
                        disabled={processing}
                    />

                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={processing}
                        className="rounded-xl border px-4 py-2 text-sm"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={processing || !data.name}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white"
                    >
                        {processing && (
                            <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        )}
                        Criar setor
                    </button>
                </div>
            </form>
        </Modal>
    );
}