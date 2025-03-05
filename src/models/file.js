const mongoose = require("mongoose");
const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }
  }, { timestamps: true });
  module.exports = mongoose.model("File", FileSchema);