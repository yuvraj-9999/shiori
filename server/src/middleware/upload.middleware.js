import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Created uploads directory:", uploadDir);
}

console.log("Upload directory:", uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const extention = path.extname(file.originalname).toLowerCase();

    const isPdfExtension = extention === ".pdf";

    const isPdfMimeType = file.mimetype === "application/pdf";
    if (!isPdfExtension || !isPdfMimeType) {
        return cb(new Error("Only PDF files are allowed"));
    }

    cb(null,true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

export default upload;