const File = require("../models/file");
const multer = require("multer");
const path = require("path");

const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed."), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, 
});


const uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const filesData = req.files.map((file) => ({
      filename: file.filename,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      sender: req.user.id,
      chat: req.body.chatId,
      group: req.body.chatId,

    }));

    const uploadedFiles = await File.insertMany(filesData);

    res.status(201).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { uploadFile, upload };

