import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
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