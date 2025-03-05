require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { initializeSocket } = require("./src/socket/socket");

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
global.io = io;
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected. Retrying...");
});

initializeSocket(io);

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/chats", require("./src/routes/chatRoutes"));

const groupRoutes = require("./src/routes/groupRoutes")(io);
app.use("/api/groups", groupRoutes);
app.use("/api/uploads", require("./src/routes/uploadRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("WebSocket initialized...");
});
