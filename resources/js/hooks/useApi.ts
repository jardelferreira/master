import { useState } from 'react';
import api from '@/lib/api';
import { showToast } from '@/lib/alerts/toast';

type Method = 'get' | 'post' | 'put' | 'delete';

export function useApi<T = any>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    async function request(
        method: Method,
        url: string,
        payload?: any,
        options?: {
            silent?: boolean;
            onSuccess?: (data: T) => void;
        }
    ) {
        setLoading(true);
        setError(null);

        try {
            const response = await api({
                method,
                url,
                data: payload,
            });

            setData(response.data);

            if (!options?.silent) {
                // opcional: sucesso global
                // showToast({ type: 'success', message: 'Sucesso' });
            }

            options?.onSuccess?.(response.data);

            return response.data;
        } catch (err: any) {
            setError(err);

            // validação (422)
            if (err.response?.status === 422) {
                return err.response.data;
            }

            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        data,
        loading,
        error,
        get: (url: string, options?: any) =>
            request('get', url, null, options),

        post: (url: string, payload?: any, options?: any) =>
            request('post', url, payload, options),

        put: (url: string, payload?: any, options?: any) =>
            request('put', url, payload, options),

        destroy: (url: string, options?: any) =>
            request('delete', url, null, options),
    };
}