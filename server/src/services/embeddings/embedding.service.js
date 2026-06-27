import axios from "axios";

const PYTHON_API_URL = (
    process.env.PYTHON_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export const generateEmbedding = async (text) => {
    try {
        const response = await axios.post(`${PYTHON_API_URL}/embeddings`, {
            text,
        });

        return response.data.embedding;
    } catch (error) {
        throw new Error(`Failed to generate embedding: ${error.message}`);
    }
};