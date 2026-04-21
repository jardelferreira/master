import axios from 'axios';
import { showToast } from '@/lib/alerts/toast';

const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

// CSRF (Laravel)
const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

if (token) {
    api.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// 🔥 INTERCEPTOR GLOBAL
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message =
            error.response?.data?.message ||
            'Ocorreu um erro inesperado';

        // auth
        if (status === 401) {
            window.location.href = '/login';
        }

        // validação (opcional tratar separado)
        if (status === 422) {
            return Promise.reject(error);
        }

        // 🔥 toast global
        showToast('error',message);

        return Promise.reject(error);
    }
);

export default api;