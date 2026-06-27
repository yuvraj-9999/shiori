import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 2048,
    },
});

/**
 * Retry a fn up to maxAttempts times with exponential backoff.
 * Retries on 503 (overloaded) and 429 (rate limited).
 */
const withRetry = async (fn, maxAttempts = 4) => {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const msg = err?.message || "";
            const isRetryable =
                msg.includes("503") ||
                msg.includes("Service Unavailable") ||
                msg.includes("429") ||
                msg.includes("Too Many Requests") ||
                msg.includes("RESOURCE_EXHAUSTED");

            if (!isRetryable || attempt === maxAttempts) {
                throw err;
            }

            // Exponential backoff: 1s, 2s, 4s …
            const delayMs = 1000 * Math.pow(2, attempt - 1);
            console.warn(`[Gemini] Attempt ${attempt} failed (${msg.slice(0, 60)}). Retrying in ${delayMs}ms…`);
            await new Promise((r) => setTimeout(r, delayMs));
            lastError = err;
        }
    }
    throw lastError;
};

export const generateAnswer = async (question, context) => {
const prompt = `
Context:
${context}

Question:
${question}

Answer the question using ONLY the context above.
If the answer is not present, say "Not found."
`;


    return withRetry(() => model.generateContent(prompt).then((r) => r.response.text()));
};
