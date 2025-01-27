const apiUrl = import.meta.env.VITE_APP_API_URL;
export const fetchCryptosAPI = async () => {
    const response = await fetch(`${apiUrl}`);
    if (!response.ok) throw new Error('Failed to fetch cryptocurrency data.');
    return response.json();
};