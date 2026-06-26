import { askQuestionService, getChatHistoryService } from "./chat.service.js";

export const askQuestion = async (req, res) => {

    const { question } = req.body;

    const result = await askQuestionService(
        question,
        req.user.userId
    );

    return res.status(200).json(
        result
    );
};

export const getChatHistory = async (req, res) => {
    try {
        const chats = await getChatHistoryService(req.user.userId);

        return res.status(200).json({
            chats,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}