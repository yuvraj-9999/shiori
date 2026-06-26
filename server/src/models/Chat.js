import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        question: {
            type: String,
            required: true,
        },

        answer: {
            type: String,
            required: true,
        },
        
        sources: [
            {
                _id: false,
                documentName: String,
                pageNumber: Number,
            },
        ],
    },

    {timestamps: true}
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;

