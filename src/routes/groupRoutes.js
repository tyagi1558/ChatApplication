const express = require("express");
const router = express.Router();
const { createGroup, addUserToGroup, getGroupMessages,sendGroupMessage } = require("../controllers/groupController");

module.exports = (io) => {
  router.post("/create", (req, res) => createGroup(req, res, io));
  router.post("/:groupId/addUser", (req, res) => addUserToGroup(req, res, io));
  router.get("/:groupId/messages", getGroupMessages);
  router.post("/:groupId/sendGroupMessage", (req, res) => sendGroupMessage(req, res, io)); 


  return router;
};
