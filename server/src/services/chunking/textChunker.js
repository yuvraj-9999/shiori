const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

export const chunkPage = (pageText, pageNumber, documentName) => {

    if (!pageText.trim()) {
        return [];
    }
    const chunks = [];

    let start = 0;
    let chunkIndex = 0;

    while (start < pageText.length) {

        let end = start + CHUNK_SIZE;

        let chunkText = pageText.slice(start, end)

        const lastSpaceIndex = chunkText.lastIndexOf(" ");

        if (lastSpaceIndex > 0) {

            chunkText = chunkText.slice(0, lastSpaceIndex);

        }

        chunkText = chunkText.trim();

        if (!chunkText) {
            break;
        }

        chunks.push({
            documentName,
            pageNumber,
            chunkIndex,
            text: chunkText,
        });

        chunkIndex++;

        start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
}