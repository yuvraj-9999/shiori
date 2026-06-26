import api from "../api/axios.js";

export const uploadDocuments = async (formData) => {

    const response = await api.post("/documents/upload",formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getDocuments = async () => {
    const response = await api.get("/documents");

    return response.data;
};

export const deleteDocument = async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`);

    return response.data;
}