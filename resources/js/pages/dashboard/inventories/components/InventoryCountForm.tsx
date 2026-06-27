import { FormField, Input, Textarea } from '@/components/ui';

interface Props {
    item: any;

    data: {
        counted_quantity: string;
        notes: string;
    };

    errors: Record<string, string>;

    processing: boolean;

    onChange: (
        field: 'counted_quantity' | 'notes',
        value: string,
    ) => void;
}

function Info({
    label,
    value,
}: {
    label: string;
    value?: React.ReactNode;
}) {
    return (
        <div className="space-y-1">

            <div className="text-xs font-medium uppercase tracking-wide text-base-500">
                {label}
            </div>

            <div className="rounded-lg border border-base-200 bg-base-50 px-3 py-2">
                {value || '-'}
            </div>

        </div>
    );
}

export default function InventoryCountForm({
    item,
    data,
    errors,
    processing,
    onChange,
}: Props) {

    return (

        <div className="space-y-8">

            <section>

                <h3 className="mb-4 text-lg font-semibold">
                    Produto
                </h3>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <Info
                        label="Produto"
                        value={item.product.name}
                    />

                    <Info
                        label="SKU"
                        value={item.product.sku}
                    />

                    <Info
                        label="Categoria"
                        value={item.product.category}
                    />

                    <Info
                        label="Unidade"
                        value={item.product.unit}
                    />

                </div>

            </section>

            <section>

                <h3 className="mb-4 text-lg font-semibold">
                    Estoque
                </h3>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <Info
                        label="Projeto"
                        value={item.stock.project.name}
                    />

                    <Info
                        label="Setor"
                        value={item.stock.sector.name}
                    />

                    <Info
                        label="Localização"
                        value={item.stock.location}
                    />

                    <Info
                        label="Lote"
                        value={item.stock.batch}
                    />

                </div>

            </section>

            <section>

                <h3 className="mb-4 text-lg font-semibold">
                    Conferência
                </h3>

                <div className="grid gap-6 md:grid-cols-2">

                    <Info
                        label="Quantidade Sistema"
                        value={item.count.system_quantity}
                    />

                    <FormField
                        label="Quantidade Contada"
                        required
                        error={errors.counted_quantity}
                    >

                        <Input
                            type="number"
                            disabled={processing}
                            value={data.counted_quantity}
                            onChange={(e) =>
                                onChange(
                                    'counted_quantity',
                                    e.target.value,
                                )
                            }
                        />

                    </FormField>

                </div>

                <div className="mt-6">

                    <FormField
                        label="Observações"
                        error={errors.notes}
                    >

                        <Textarea
                            rows={4}
                            disabled={processing}
                            value={data.notes}
                            onChange={(e) =>
                                onChange(
                                    'notes',
                                    e.target.value,
                                )
                            }
                        />

                    </FormField>

                </div>

            </section>

        </div>

    );
}