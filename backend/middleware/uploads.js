import multer from "multer";
import path from "path";
import fs from "fs";

// Middleware untuk mengatur path upload secara dinamis
export const setUploadPath = (folderPath) => {
  const dynamicUploadPath = path.resolve(`uploads/${folderPath}`);
  
  if (!fs.existsSync(dynamicUploadPath)) {
    fs.mkdirSync(dynamicUploadPath, { recursive: true });
  }

  return (req, res, next) => {
    req.uploadPath = dynamicUploadPath; 
    console.log("Upload path set to:", req.uploadPath); // Debugging log
    next();
  };
};


// Konfigurasi multer dengan penyimpanan dinamis
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.uploadPath || path.resolve("uploads/default"); // Path dinamis atau default
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter,
});

export default upload;

