const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchAllNews= async (page = 1, limit = 20, is_active=true)=>{
    try{
        const url=is_active?apiUrl+"/tips":apiUrl+"/admin/tips"
        const response = await fetch(`${url}?page=${page}&limit=${limit}`,
            {credentials: "include"});
        if (!response.ok) {
            const errorData = await response.json(); // Try to get error details from the server
            throw new Error(errorData.message || "Failed to fetch news"); // Throw error with message
        }
        return await response.json();
    }catch(error){
        console.error("Error fetching news:", error);
        throw error;
    }

}
export const fetchNewsById = async (id)=>{
    try{
        const response = await fetch(`${apiUrl}/tips/${id}`);
        const data = await response.json();
        if (!response.ok) {
            return { errors: data.errors } ;
        }
        return data
    }catch (error){
        console.error("Error fetching news by id:", error);
        throw error;
    }

}
export const addNews = async (formData) => {
    try {
        const response = await fetch(`${apiUrl}/admin/create_tip`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const responseData = await response.json();

        // ✅ Allow both 200 and 201 as successful responses
        if (response.status !== 200 && response.status !== 201) {
            return { errors: responseData.errors || responseData.error || "Something went wrong" };
        }

        return responseData;
    } catch (error) {
        console.error("Error adding news:", error);
        return { errors: ["Failed to connect to the server"] };
    }
};

export const editNews = async (id,data)=>{
    try {
        const response = await fetch(`${apiUrl}/admin/edit_tip/${id}`,{
            method: "PUT",
            body: data,
            credentials: "include",
        });
        const responseData = await response.json();
        if (!response.ok) {
            return { errors: responseData.errors } ;
        }
        return responseData
    }catch (error) {
        console.error("Error editing news:", error);
        throw error;
    }
}

export  const deleteNews = async (id)=>{
    try{
        const response = await fetch(`${apiUrl}/admin/delete_tip/${id}`,{
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await response.json();
        if (!response.ok) {
            return { errors: data.errors } ;
        }
        return data
    }catch(error){
        console.error("Error deleting news:", error);
        throw error;
    }

}
