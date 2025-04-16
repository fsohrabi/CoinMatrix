const apiURL = import.meta.env.VITE_APP_API_URL + '/auth';
import { fetchWithAuth } from './fetchWithAuth';
import Cookies from 'js-cookie';


export const registerUser = async (userData) => {
    const response = await fetch(`${apiURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log(response)
    if (!response.ok) {
        return { errors: data.errors || { server: ["Registration failed."] } };
    }

    return data
};

export const login = async (userData) => {
    const response = await fetch(`${apiURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        return { errors: data.errors || { server: ["Login failed."] } };
    }
    const { access_token, refresh_token } = data;

    Cookies.set('access_token', access_token, { expires: 1 }); // expires in 1 day
    Cookies.set('refresh_token', refresh_token, { expires: 7 }); // expires in 7 days
    return data
};


export const logout = async () => {
    await fetchWithAuth(`${apiURL}/logout`, {
        method: "DELETE",
        credentials: "include",
    });

    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
};

// Check Current User
export const fetchCurrentUser = async () => {

    const response = await fetchWithAuth(`${apiURL}/me`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) return null;

    return response.json();
};

export const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('refresh_token');

    const response = await fetch(`${apiURL}/refresh`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error("Token refresh failed");

    const data = await response.json();
    Cookies.set('access_token', data.access_token);
    return data.access_token;
};
