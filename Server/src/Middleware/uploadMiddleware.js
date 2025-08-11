import multer from "multer";
import path from "path";
import fs from "fs"; // Import File System module

// Ensure directory exists
const ensureDirectoryExistence = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // Create directory recursively
    }
};

// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = "uploads/";

        // Check if it's a profile picture upload
        if (req.baseUrl.includes("/users")) {
            uploadPath = "uploads/profiles/"; // Store profile pictures in a separate folder
        }

        ensureDirectoryExistence(uploadPath); // Ensure directory exists before saving files
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|pdf|docx/; // Allow images & documents
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png, gif) and documents (pdf, docx) are allowed"));
    }
};

// Upload Middleware
export const uploadProduct = multer({ storage, fileFilter }).single("image"); // Single file product
export const uploadProfile = multer({ storage, fileFilter }).single("profilePicture"); // Single file (for profile)