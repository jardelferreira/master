import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Provider } from '@/types/provider';

type Props = {
    open: boolean;
    onClose: () => void;
    provider?: Provider | null;
};

type FormData = {
    id: number;
    name: string;
    trade_name: string;
    document: string;
    email: string;
    phone: string;
    website: string;
    contact_name: string;
    city: string;
    state: string;
    active: boolean;
};

const EMPTY_FORM: FormData = {
    id: 0,
    name: '',
    trade_name: '',
    document: '',
    email: '',
    phone: '',
    website: '',
    contact_name: '',
    city: '',
    state: '',
    active: true,
};

export default function ProviderFormModal({ open, onClose, provider }: Props) {
    const isEditing = !!provider;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormData>(EMPTY_FORM);

    // Preenche o form ao abrir para edição
    useEffect(() => {
        if (open) {
            if (provider) {
                console.log(provider)
                setData({
                    id: provider.id,
                    name: provider.name ?? '',
                    trade_name: provider.trade_name ?? '',
                    document: provider.document ?? '',
                    email: provider.email ?? '',
                    phone: provider.phone ?? '',
                    website: provider.website ?? '',
                    contact_name: provider.contact_name ?? '',
                    city: provider.city ?? '',
                    state: provider.state ?? '',
                    active: provider.active ?? true,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [open, provider]);

    function handleClose() {
        reset();
        clearErrors();
        onClose();
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            put(route('admin.providers.update', provider.id), {
                onSuccess: handleClose,
            });
        } else {
            post(route('admin.providers.store'), {
                onSuccess: handleClose,
            });
        }
    }

    if (!open) return null;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            {/* Modal */}
            <div className="relative w-full max-w-2xl rounded-2xl border border-base-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-base-900">
                            {isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                        </h2>
                        <p className="text-sm text-base-400 mt-0.5">
                            {isEditing
                                ? 'Atualize os dados do fornecedor abaixo.'
                                : 'Preencha os dados para cadastrar um novo fornecedor.'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 hover:bg-base-100 text-base-400 hover:text-base-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Razão Social */}
                        <Field
                            label="Razão Social"
                            required
                            className="sm:col-span-2"
                            error={errors.name}
                        >
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ex: Empresa LTDA"
                                className={inputClass(!!errors.name)}
                            />
                        </Field>

                        {/* Nome Fantasia */}
                        <Field label="Nome Fantasia" className="sm:col-span-2" error={errors.trade_name}>
                            <input
                                type="text"
                                value={data.trade_name}
                                onChange={(e) => setData('trade_name', e.target.value)}
                                placeholder="Ex: Empresa Fantasia"
                                className={inputClass(!!errors.trade_name)}
                            />
                        </Field>

                        {/* CNPJ / CPF */}
                        <Field label="CNPJ / CPF" error={errors.document}>
                            <input
                                type="text"
                                value={data.document}
                                onChange={(e) => setData('document', e.target.value)}
                                placeholder="00.000.000/0001-00"
                                className={inputClass(!!errors.document)}
                            />
                        </Field>

                        {/* Contato */}
                        <Field label="Nome do Contato" error={errors.contact_name}>
                            <input
                                type="text"
                                value={data.contact_name}
                                onChange={(e) => setData('contact_name', e.target.value)}
                                placeholder="Ex: João da Silva"
                                className={inputClass(!!errors.contact_name)}
                            />
                        </Field>

                        {/* E-mail */}
                        <Field label="E-mail" error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="contato@empresa.com"
                                className={inputClass(!!errors.email)}
                            />
                        </Field>

                        {/* Telefone */}
                        <Field label="Telefone" error={errors.phone}>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="(81) 99999-9999"
                                className={inputClass(!!errors.phone)}
                            />
                        </Field>

                        {/* Website */}
                        <Field label="Website" className="sm:col-span-2" error={errors.website}>
                            <input
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                placeholder="https://empresa.com.br"
                                className={inputClass(!!errors.website)}
                            />
                        </Field>

                        {/* Cidade */}
                        <Field label="Cidade" error={errors.city}>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="Ex: Recife"
                                className={inputClass(!!errors.city)}
                            />
                        </Field>

                        {/* Estado */}
                        <Field label="Estado (UF)" error={errors.state}>
                            <input
                                type="text"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value.toUpperCase())}
                                placeholder="PE"
                                maxLength={2}
                                className={inputClass(!!errors.state)}
                            />
                        </Field>

                        {/* Status */}
                        <div className="sm:col-span-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setData('active', !data.active)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-core-500 focus:ring-offset-1 ${
                                    data.active ? 'bg-core-600' : 'bg-base-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                        data.active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                            <span className="text-sm font-medium text-base-700">
                                {data.active ? 'Fornecedor ativo' : 'Fornecedor inativo'}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-base-100 bg-base-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex items-center justify-center rounded-md border border-base-300 px-4 py-2 text-sm font-medium text-base-700 hover:bg-base-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-md bg-core-600 px-5 py-2 text-sm font-medium text-white hover:bg-core-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                        >
                            {processing
                                ? 'Salvando...'
                                : isEditing
                                ? 'Salvar alterações'
                                : 'Cadastrar fornecedor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function inputClass(hasError: boolean) {
    return `w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-core-500 focus:outline-none transition-colors ${
        hasError ? 'border-red-500 bg-red-50' : 'border-base-300 bg-white'
    }`;
}

type FieldProps = {
    label: string;
    required?: boolean;
    error?: string;
    className?: string;
    children: React.ReactNode;
};

function Field({ label, required, error, className = '', children }: FieldProps) {
    return (
        <div className={className}>
            <label className="mb-1 block text-sm font-medium text-base-700">
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}