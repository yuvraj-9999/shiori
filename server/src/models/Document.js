import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        originalName: {
            type: String,
            required: true,
        },

        storedFileName: {
            type: String,
            required: true,
        },

        totalPages: {
            type: Number,
            required: true,
        },

        totalChunks: {
            type: Number,
            required: true,
        },

        
    },
    {
        timestamps: true,
    }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;