const API_URL = import.meta.env.VITE_APP_API_URL;


export const fetchWatchlist = async () => {
    try {
        const response = await fetch(`${API_URL}/user/watchlist`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch watchlist');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        throw error;
    }
};

export const addToWatchlist = async (cryptoId) => {
    try {
        const response = await fetch(`${API_URL}/user/watchlist`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coin_id: cryptoId }),
        });

        if (!response.ok) {
            throw new Error('Failed to add to watchlist');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw error;
    }
};

export const removeFromWatchlist = async (cryptoId) => {
    try {
        const response = await fetch(`${API_URL}/user/watchlist/${cryptoId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to remove from watchlist');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        throw error;
    }
}; 