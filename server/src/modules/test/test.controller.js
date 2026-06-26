import { generateEmbedding } from "../../services/embeddings/embedding.service.js";
import { searchChunks } from "../../services/chroma/chroma.service.js";
import { generateAnswer } from "../../services/ai/gemini.service.js";

export const testEmbedding = async (req, res) => {
    const embedding = await generateEmbedding("Machine learning is a subest of AI");

    return res.status(200).json({
        dimensions: embedding.length, 
    });
}

export const askQuestion = async (req, res) => {
    const { question } = req.body;

    const searchResults = await searchChunks(question);

    const sources = searchResults.metadatas[0].map((metadata)=>({
        documentName: metadata.documentName,
        pageNumber: metadata.pageNumber,
    })
    );

    const context = searchResults.documents[0].join("\n\n");

    const answer = await generateAnswer(question, context);

    return res.status(200).json({
        answer,
        sources,
    });
}