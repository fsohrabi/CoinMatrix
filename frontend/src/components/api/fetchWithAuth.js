import Cookies from 'js-cookie';
import { refreshAccessToken } from "./auth";

export const fetchWithAuth = async (url, options = {}, retry = true) => {
    const token = Cookies.get('access_token');

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    // Only set Content-Type if it's not FormData
    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 && retry) {
        try {
            const newAccessToken = await refreshAccessToken();
            Cookies.set('access_token', newAccessToken);

            const newHeaders = {
                ...options.headers,
                Authorization: `Bearer ${newAccessToken}`,
            };

            if (!isFormData) {
                newHeaders['Content-Type'] = 'application/json';
            }

            return fetch(url, { ...options, headers: newHeaders });
        } catch (err) {
            console.error('Refresh token failed, logging out...');
            // Optionally logout user or redirect
        }
    }

    return response;
};
