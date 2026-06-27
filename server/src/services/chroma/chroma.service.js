import axios from "axios";

const PYTHON_API_URL = (
    process.env.PYTHON_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export const storeChunks = async (chunks) => {
    try {
        
        const response = await axios.post(`${PYTHON_API_URL}/store-chunks`,{
            chunks,
        });

        return response.data;
    } catch (error) {
        throw new Error(`Failed to store chunks: ${error.message}`);
    }
};

export const searchChunks = async (query, userId) => {
    try {
        const response = await axios.post(`${PYTHON_API_URL}/search`,
            {
                query,
                userId
            }
        );

        return response.data;

    } catch (error) {
        throw new Error(`Failed to search chunks: ${error.message}`);
    }
};

export const deleteDocumentChunks = async (userId, documentName) => {
    try {
        
        const response = await axios.post(`${PYTHON_API_URL}/delete-document`,{
            userId,
            documentName,
        });

        return response.data;
    } catch (error) {
        throw new Error(`Failed to delete document chunks: ${error.message}`);
    }
};