const Message = require("../models/message");
const Chat = require("../models/chat");

const sendMessage = async (req, res) => {
  try {
    const { content, receiverId, groupId } = req.body;

    let chat;
    
    if (groupId) {
      chat = await Chat.findById(groupId);
      if (!chat) return res.status(404).json({ message: "Group chat not found" });
    } else {
      chat = await Chat.findOne({
        participants: { $all: [req.user.id, receiverId] }
      });

      if (!chat) {
        chat = new Chat({ participants: [req.user.id, receiverId] });
        await chat.save();
      }
    }

    const message = new Message({ chat: chat._id, sender: req.user.id, content });
    await message.save();

    await Chat.findByIdAndUpdate(chat._id, { $push: { messages: message._id } });
    global.io.to(chat._id.toString()).emit("receive_message", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatHistory = async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.chatId)
        .populate({
          path: "messages",
          populate: { path: "sender", select: "name email" } 
        })
        .populate("participants", "name email");
  
      if (!chat) return res.status(404).json({ message: "Chat not found" });
  
      if (!chat.participants.some((p) => p._id.toString() === req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
      }
  
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = { sendMessage, getChatHistory };
