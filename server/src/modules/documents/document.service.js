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
        const pdfData = await extractPdf(file.path);

        const chunks = [];

        for(const page of pdfData.pages){
            const pageChunks = chunkPage(page.text,page.pageNumber,file.originalname);
            chunks.push(...pageChunks);
        }

        const chunksWithUser = chunks.map(chunk => ({
            ...chunk,
            userId
        }));

        const embeddedChunks = await embedChunks(chunksWithUser);

        console.log("Uploading chunks:", chunks.length);
console.log("First chunk user:", chunks[0].userId);

console.log("Chunks sent to Python.");

        await storeChunks(embeddedChunks);

        await Document.create({
            userId,
            originalName: file.originalname,
            storedFileName: file.filename,
            totalPages: pdfData.totalPages,
            totalChunks: chunks.length,
        });

        extractedDocuments.push({
            originalName: file.originalname,
            storedFileName: file.filename,
            totalPages: pdfData.totalPages,
            pages: pdfData.pages,
            totalChunks: chunks.length,
            chunks:embeddedChunks,
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