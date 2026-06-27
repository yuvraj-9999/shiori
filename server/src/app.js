import express from 'express';
import cors from 'cors';
import documentRoutes from "./modules/documents/document.routes.js";
import testRoutes from "./modules/test/test.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://shiori-ivory.vercel.app",
        ],
    })
);
app.use(express.json());

app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/test", testRoutes);

app.get("/health", (req,res) => {
    res.status(200).json({
        status: "Ok",
    });
});

export default app;