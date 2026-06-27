import { extractPdf } from "../../services/pdf/pdfExtractor.js";
import { chunkPage } from "../../services/chunking/textChunker.js";
import { embedChunks } from "../../services/embeddings/embeddingProcessor.js";
import { storeChunks, deleteDocumentChunks } from "../../services/chroma/chroma.service.js";
import Document from "../../models/Document.js";
import path from "path"

export const processDocuments = async (files, userId) => {
    if(!files || files.length === 0){
        throw new Error("No files provided");
    }

    const extractedDocuments = [];

    for(const file of files){
        console.log(`[mem] pipeline start — before extractPdf: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)} MB`);

        const pdfData = await extractPdf(file.path);

        console.log(`[mem] pipeline — after extractPdf: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)} MB`);

        // Capture the scalar before we start iterating pages, so it remains
        // available after pdfData.pages is cleared below.
        const totalPages = pdfData.totalPages;

        const chunks = [];

        for(const page of pdfData.pages){
            const pageChunks = chunkPage(page.text,page.pageNumber,file.originalname);
            chunks.push(...pageChunks);
        }

        // Page text has been fully consumed by chunkPage(). Releasing the
        // reference now lets the GC collect all page-text strings before the
        // embedChunks() network loop runs, keeping peak heap lower.
        pdfData.pages = null;

        console.log(`[mem] pipeline — after chunking (${chunks.length} chunks, pages cleared): ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)} MB`);

        const chunksWithUser = chunks.map(chunk => ({
            ...chunk,
            userId
        }));

        // Capture count now; chunks array will be cleared next.
        const totalChunks = chunks.length;

        // chunksWithUser is the definitive copy with userId attached.
        // Clearing chunks removes the duplicate reference to the same text
        // strings so the GC is free to collect them if needed.
        chunks.length = 0;

        const embeddedChunks = await embedChunks(chunksWithUser);

        console.log(`[mem] pipeline — after embedChunks: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)} MB`);

        // chunksWithUser has been fully consumed by embedChunks().
        // Clearing it drops the last reference to the pre-embedding chunk
        // objects before the storeChunks() network call.
        chunksWithUser.length = 0;

        console.log("Uploading chunks:", totalChunks);
        console.log("First chunk user:", embeddedChunks[0]?.userId);
        console.log("Chunks sent to Python.");

        await storeChunks(embeddedChunks);

        console.log(`[mem] pipeline — after storeChunks: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)} MB`);

        // embeddedChunks has been stored. Clearing it releases ~20 × 1536
        // float values (≈245 KB of JS heap) before Document.create() and
        // JSON serialization of the response run.
        embeddedChunks.length = 0;

        await Document.create({
            userId,
            originalName: file.originalname,
            storedFileName: file.filename,
            totalPages,
            totalChunks,
        });

        // Return only the metadata the frontend needs.
        // Omitting pdfData.pages and embeddedChunks prevents JSON.stringify
        // from allocating a large contiguous string for raw text and
        // 1536-dimensional float vectors the browser does not use.
        extractedDocuments.push({
            originalName: file.originalname,
            storedFileName: file.filename,
            totalPages,
            totalChunks,
        });
    }

    return extractedDocuments;
};

export const getUserDocumentsService = async (userId) => {
    const documents = await Document.find({
        userId,
    }).select(
        "originalName totalPages totalChunks createdAt"
    ).sort({
        createdAt: -1,
    });

    return documents;
}

export const deleteDocumentService = async (documentId, userId) => {
    // First, check if the document exists at all.
    const document = await Document.findById(documentId);

    if (!document) {
        const err = new Error("Document not found.");
        err.code = "NOT_FOUND";
        throw err;
    }

    // Then enforce ownership.
    if (document.userId.toString() !== userId.toString()) {
        const err = new Error("You do not have permission to perform this action.");
        err.code = "FORBIDDEN";
        throw err;
    }

    await deleteDocumentChunks(userId, document.originalName);

    const filePath = path.join(process.cwd(), "uploads", document.storedFileName);

    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.log("File already deleted or missing");
    }

    await Document.findByIdAndDelete(documentId);

    return {
        success: true,
    };

};