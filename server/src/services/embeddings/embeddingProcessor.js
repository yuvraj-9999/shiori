import { generateEmbedding } from "./embedding.service.js";

export const embedChunks = async (chunks) => {
    const embeddedChunks = [];

    for(const chunk of chunks){
        const embedding  = await generateEmbedding(chunk.text);

        embeddedChunks.push({
            ...chunk,
            embedding,
        });
    }

    return embeddedChunks;
}