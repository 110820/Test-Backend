import multer from "multer";
import path from "path";

// Configure file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");    // Save files to uploads/ folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)  // Unique filename with timestamp
    );
  },
});

const upload = multer({ storage });

export default upload;