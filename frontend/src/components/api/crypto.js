const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchAllCryptos = async () => {
    try {
        const response = await fetch(`${apiUrl}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cryptocurrencies');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        throw error;
    }
};

export const fetchCryptoById = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/coin/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cryptocurrency details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cryptocurrency details:', error);
        throw error;
    }
};

export const searchCryptosAPI = async (query) => {
    try {
        const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to search cryptocurrencies');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching cryptocurrencies:', error);
        throw error;
    }
};

export const fetchCryptosAPI = async (page = 1, limit = 20) => {
    try {
        const response = await fetch(`${apiUrl}/?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cryptocurrency data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        throw error;
    }
};

