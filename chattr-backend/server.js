require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");   // <-- Atlas connection
const Message = require("./models/Message"); // <-- Your Message model

const app = express();
app.use(cors());
app.use(express.json());
// routes
app.use("/api/auth", require("./routes/auth"));


const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

// ------------------------
// 🔗 CONNECT TO MONGO ATLAS
// ------------------------
connectDB();   // Calls mongoose.connect(MONGO_URI)

// ------------------------------
// HTTP + SOCKET.IO SERVER SETUP
// ------------------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// Map of socketId → username
const onlineUsers = new Map();

// -----------------------------------------
// 🔐 SOCKET AUTH MIDDLEWARE (JWT REQUIRED)
// -----------------------------------------
io.use((socket, next) => {
  try {
    const tokenRaw = socket.handshake.auth && socket.handshake.auth.token;
    if (!tokenRaw) return next(new Error("no token provided"));

    // Accept both "Bearer <token>" and raw token
    const token = tokenRaw.startsWith("Bearer ")
      ? tokenRaw.split(" ")[1]
      : tokenRaw;

    const payload = jwt.verify(token, JWT_SECRET);

    // attach user data to socket
    socket.user = { id: payload.id, username: payload.username };

    return next();
  } catch (err) {
    console.error("socket auth error:", err.message);
    return next(new Error("authentication error"));
  }
});

// ------------------------------
// 🔌 SOCKET CONNECTION HANDLERS
// ------------------------------
io.on("connection", (socket) => {
  console.log(
    "socket connected:",
    socket.id,
    "user:",
    socket.user.username
  );

  onlineUsers.set(socket.id, socket.user.username);

  // JOIN ROOM
  socket.on("joinRoom", async (room) => {
    try {
      // leave all previous rooms
      for (const r of socket.rooms) {
        if (r !== socket.id) socket.leave(r);
      }

      socket.join(room);

      // fetch last 100 messages
      const history = await Message.find({ room })
        .sort({ time: 1 })
        .limit(100)
        .lean();

      socket.emit("chatHistory", history);

      socket.to(room).emit("userJoined", {
        user: socket.user.username,
        room
      });
    } catch (err) {
      console.error("joinRoom error:", err);
    }
  });

  // LEAVE ROOM
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    socket.to(room).emit("userLeft", {
      user: socket.user.username,
      room
    });
  });

  // SEND MESSAGE
  socket.on("sendMessage", async (payload) => {
    try {
      const { sender, message, room } = payload;
      if (!room || !message) return;

      const msg = await Message.create({
        sender,
        message,
        room,
        time: payload.time || Date.now()
      });

      io.to(room).emit("receiveMessage", {
        sender: msg.sender,
        message: msg.message,
        room: msg.room,
        time: msg.time
      });
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  // TYPING INDICATOR
  socket.on("typing", ({ room, isTyping }) => {
    socket.to(room).emit("userTyping", {
      user: socket.user.username,
      isTyping
    });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
    onlineUsers.delete(socket.id);
  });
});

// -----------------------------
// START SERVER
// -----------------------------
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

