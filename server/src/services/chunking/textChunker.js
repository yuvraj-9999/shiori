const MAX_CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

export const chunkPage = (pageText, pageNumber, documentName) => {
    if (!pageText.trim()) {
        return [];
    }

    const chunks = [];
    let chunkIndex = 0;

    // Split page into paragraphs
    const paragraphs = pageText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

    let currentChunk = "";

    for (const paragraph of paragraphs) {

        // If paragraph itself is too long, split it safely
        if (paragraph.length > MAX_CHUNK_SIZE) {

            if (currentChunk) {
                chunks.push({
                    documentName,
                    pageNumber,
                    chunkIndex: chunkIndex++,
                    text: currentChunk.trim(),
                });

                currentChunk = "";
            }

            let start = 0;

            while (start < paragraph.length) {

                let end = Math.min(start + MAX_CHUNK_SIZE, paragraph.length);

                let piece = paragraph.slice(start, end);

                // Don't cut a word in half
                if (end < paragraph.length) {
                    const lastSpace = piece.lastIndexOf(" ");
                    if (lastSpace > 0) {
                        piece = piece.slice(0, lastSpace);
                    }
                }

                chunks.push({
                    documentName,
                    pageNumber,
                    chunkIndex: chunkIndex++,
                    text: piece.trim(),
                });

                start += piece.length - CHUNK_OVERLAP;

                // Don't start next chunk in the middle of a word
                while (
                    start < paragraph.length &&
                    paragraph[start] !== " "
                ) {
                    start++;
                }
            }

            continue;
        }

        // If paragraph fits, merge it into current chunk
        if (
            currentChunk.length + paragraph.length + 2 <= MAX_CHUNK_SIZE
        ) {
            currentChunk +=
                (currentChunk ? "\n\n" : "") + paragraph;
        } else {

            chunks.push({
                documentName,
                pageNumber,
                chunkIndex: chunkIndex++,
                text: currentChunk.trim(),
            });

            currentChunk = paragraph;
        }
    }

    if (currentChunk.trim()) {
        chunks.push({
            documentName,
            pageNumber,
            chunkIndex: chunkIndex++,
            text: currentChunk.trim(),
        });
    }

    return chunks;
};