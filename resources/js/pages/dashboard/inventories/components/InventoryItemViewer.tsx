import { useEffect, useState } from 'react';
import axios from 'axios';

import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from '@/components/ui';

import { Button } from '@/components/ui';
import InventoryCountForm from './InventoryCountForm';
import { InventoryItemRow } from './Columns';
import { showToast } from '@/lib/alerts/toast';

interface Props {
    isOpen: boolean;
    inventoryItemId: number | null;
    onClose: () => void;
    onSaved: (response: {
        item: InventoryItemRow;
        statistics: {
            items: number;
            counted: number;
            pending: number;
            adjustments: number;
        };
        status: any;
    }) => void;
}

export default function InventoryItemViewer({
    isOpen,
    inventoryItemId,
    onClose,
    onSaved,
}: Props) {

    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [item, setItem] = useState<any>(null);

    const [data, setData] = useState({
        counted_quantity: '',
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {

        if (!isOpen || !inventoryItemId) {
            return;
        }

        setLoading(true);
        setErrors({});

        axios
            .get(route('admin.inventories.items.show', inventoryItemId))
            .then(({ data }) => {

                const item = data.data;

                setItem(item);

                setData({
                    counted_quantity:
                        item.count.counted_quantity?.toString() ?? '',
                    notes: item.count.notes ?? '',
                });

            })
            .finally(() => {
                setLoading(false);
            });

    }, [isOpen, inventoryItemId]);

    function handleChange(
        field: 'counted_quantity' | 'notes',
        value: string,
    ) {
        setData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function handleSubmit() {

        if (!inventoryItemId) {
            return;
        }

        setProcessing(true);
        setErrors({});

        axios
            .put(
                route(
                    'admin.inventories.items.update',
                    inventoryItemId,
                ),
                data,
            )
            .then(({ data }) => {
                if(data.success === false){
                    console.log(data.success)
                    showToast('error',data.message)
                }
                onSaved(data.data)
                onClose();
                showToast('success', "Item atualizado com sucesso")
            })
            .catch((error) => {

                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                }

            })
            .finally(() => {

                setProcessing(false);

            });

    }

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
        >

            <ModalHeader
                title="Conferência do Item"
                onClose={onClose}
            >

                {!loading && item && (

                    <p className="mt-1 text-sm text-base-500">
                        {item.product.name}
                    </p>

                )}

            </ModalHeader>

            <ModalBody>

                {loading ? (

                    <div className="flex h-64 items-center justify-center">

                        Carregando...

                    </div>

                ) : item ? (

                    <InventoryCountForm
                        item={item}
                        data={data}
                        errors={errors}
                        processing={processing}
                        onChange={handleChange}
                    />

                ) : (

                    <div className="flex h-64 items-center justify-center">

                        Item não encontrado.

                    </div>

                )}

            </ModalBody>

            <ModalFooter className="flex justify-end gap-3">

                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={processing}
                >
                    Cancelar
                </Button>

                <Button
                    onClick={handleSubmit}
                    disabled={processing || loading}
                >
                    Salvar
                </Button>

            </ModalFooter>

        </Modal>

    );

}