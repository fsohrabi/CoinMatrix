const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchCryptosAPI = async (page = 1, limit = 20) => {
    const response = await fetch(`${apiUrl}?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch cryptocurrency data.');
    return response.json();
};