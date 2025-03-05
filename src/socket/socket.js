module.exports.initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected with Socket ID: ${socket.id}`);

    socket.on("join_room", ({ chatId }) => {
      socket.join(chatId);
      console.log(`User joined chat room ${chatId}`);
    });

    socket.on("join_group", ({ groupId }) => {
      socket.join(groupId);
      console.log(`User joined group ${groupId}`);
    });

 
    socket.on("send_message", async ({ chatId, senderId, content }) => {
      try {
        const Message = require("../models/message");
        const message = new Message({ chat: chatId, sender: senderId, content });
        await message.save();

        console.log(`Private message in chat ${chatId}:`, content);

        io.to(chatId).emit("receive_message", message);
      } catch (error) {
        console.error("Error sending private message:", error.message);
      }
    });

    socket.on("send_group_message", async ({ groupId, senderId, content }) => {
      try {
        const Message = require("../models/message");
        const Group = require("../models/group");

        const group = await Group.findById(groupId).populate("members");
        if (!group) return console.error(`Group ${groupId} not found`);

        const message = new Message({ chat: groupId, sender: senderId, content });
        await message.save();

        console.log(`New group message in ${groupId}: ${content}`);

        group.members.forEach((member) => {
          io.to(member.toString()).emit("group_message", { groupId, message });
        });
      } catch (error) {
        console.error("Error sending group message:", error.message);
      }
    });

    socket.on("send_file", async ({ groupId, senderId, fileData }) => {
      try {
        const File = require("../models/file");
        const file = new File({ groupId, sender: senderId, fileData });
        await file.save();

        console.log(`New file sent in group ${groupId}`);

        io.to(groupId).emit("receive_file", { groupId, file });
      } catch (error) {
        console.error("Error sending file:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
