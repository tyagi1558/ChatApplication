const mongoose = require("mongoose");
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }]
  }, { timestamps: true });
  module.exports = mongoose.model("groups", GroupSchema);