const Group = require("../models/group");
const Message = require("../models/message");

const createGroup = async (req, res, io) => {
  try {
    const { name, members } = req.body;
    const group = new Group({ name, members });
    await group.save();

    console.log("New group created:", group.name);

    members.forEach((member) => {
      io.to(member).emit("group_created", group);
    });

    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const addUserToGroup = async (req, res, io) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    await Group.findByIdAndUpdate(groupId, { $push: { members: userId } });

    console.log(`User ${userId} added to group ${groupId}`);

    io.to(groupId).emit("user_added_to_group", { groupId, userId });

    res.json({ message: "User added to group" });
  } catch (error) {
    console.error("Error adding user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("messages");
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const sendGroupMessage = async (req, res, io) => {
    try {
      const { groupId } = req.params;
      const { senderId, content } = req.body;
      const group = await Group.findById(groupId).populate("members");
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      const message = new Message({
        sender: senderId,
        content,
        chat: groupId, 
      });
  
      await message.save();
  
      await Group.findByIdAndUpdate(groupId, { $push: { messages: message._id } });
  
      console.log(`New message in group ${groupId}: ${content}`);
  
      group.members.forEach((member) => {
        io.to(member.toString()).emit("new_group_message", { groupId, message });
      });
  
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending group message:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = { createGroup, addUserToGroup, getGroupMessages,sendGroupMessage };
