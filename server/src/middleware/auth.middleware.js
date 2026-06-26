import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "AUTH_REQUIRED",
            message: "Authentication required.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "TOKEN_EXPIRED",
                message: "Your session has expired. Please sign in again.",
            });
        }

        return res.status(401).json({
            error: "INVALID_TOKEN",
            message: "Authentication failed.",
        });
    }
}