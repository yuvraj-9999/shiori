import { searchChunks } from "../../services/chroma/chroma.service.js";
import { generateAnswer } from "../../services/ai/gemini.service.js";
import Chat from "../../models/Chat.js";

export const askQuestionService = async (question, userId) => {

    console.log("QUESTION:", question);
console.log("USER ID:", userId);

    const searchResults = await searchChunks(
        question,
        userId
    );

    console.log(JSON.stringify(searchResults, null, 2));

    const context = searchResults.documents[0].join(
        "\n\n"
    );

    const answer = await generateAnswer(
        question,
        context
    );

    const sources = [...new Map(
        searchResults.metadatas[0].map(
            (metadata) => [
                `${metadata.documentName}-${metadata.pageNumber}`,
                {
                    documentName: metadata.documentName,
                    pageNumber: metadata.pageNumber,
                },
            ]
        )
    ).values(),
    ];

    await saveChatService(
        userId,
        question,
        answer,
        sources,
    );

    return {
        answer,
        sources,
    };
};

export const saveChatService = async (userId, question, answer, sources) => {
    const chat = await Chat.create({
        userId,
        question,
        answer,
        sources,
    });

    return chat;
};

export const getChatHistoryService = async (userId) => {
    const chats = await Chat.find({
        userId,
    }).select(
        "question answer sources createdAt"
    ).sort({
        createdAt: -1,
    });

    return chats;
};