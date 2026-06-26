import { processDocuments, getUserDocumentsService, deleteDocumentService } from "./document.service.js";

export const uploadDocuments = async (req, res) => {
    try {
        const documents = await processDocuments(req.files, req.user.userId);

        return res.status(200).json({
            success: true,
            documents,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

export const getUserDocuments = async (req, res) => {
    try {
        
        const documents = await getUserDocumentsService(req.user.userId);

        return res.status(200).json({
            documents
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to fetch documents"
        });
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const result = await deleteDocumentService(req.params.id, req.user.userId);

        return res.status(200).json(result);
    } catch (error) {
        if (error.code === "FORBIDDEN") {
            return res.status(403).json({
                error: "FORBIDDEN",
                message: error.message,
            });
        }

        if (error.code === "NOT_FOUND") {
            return res.status(404).json({
                error: "NOT_FOUND",
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete document",
        });
    }
}