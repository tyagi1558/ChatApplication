const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "file"], default: "text" }
  }, { timestamps: true });
  module.exports = mongoose.model("Message", MessageSchema);