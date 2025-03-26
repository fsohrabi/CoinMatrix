const apiURL = import.meta.env.VITE_APP_API_URL + '/auth';

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
        credentials: "include", // Important for cookies
})
const data = await response.json();
if (!response.ok) {
    return { errors: data.errors || { server: ["Login failed."] } };
}
return data
}

// Logout User
export const logout = async () => {
    await fetch(`${apiURL}/logout`, {
    method: "DELETE",
        credentials: "include",
});
};

// Check Current User
export const fetchCurrentUser = async () => {
    const response = await fetch(`${apiURL}/me`, {
    method: "GET",
        credentials: "include", // Important for cookies
        headers: {
        "Content-Type": "application/json"
    }
});

if (!response.ok) return null;

return response.json();
};