
const express = require("express");
const router = express.Router();
const { uploadFile, upload } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/", authMiddleware, upload.array("files", 5), uploadFile);
module.exports = router;
