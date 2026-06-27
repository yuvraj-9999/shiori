import app from "./app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import fs from "fs";
import path from "path";



const PORT = env.PORT;

console.log("CWD:", process.cwd());

const uploadDir = path.join(process.cwd(), "uploads");

console.log("Upload dir:", uploadDir);
console.log("Exists:", fs.existsSync(uploadDir));

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Created uploads directory");
}
const startServer = async () => {

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`);
    });

}

startServer();
