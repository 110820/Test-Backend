import multer from "multer";

// Configure memory storage for S3 upload
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;