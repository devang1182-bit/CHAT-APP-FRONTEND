import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./src/firebase/firebase.js";

const port = 4000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Socket server is running" });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("onConnection", (uid) => {
    console.log("User logged in:", uid);
    socket.data.id = uid;
  });

  socket.joinRoom = (roomId) => {};
  socket.on("joinRoom", (roomId) => {
    console.log(`${socket.id} joined room: ${roomId}`);
    socket.join(roomId);
  });

  socket.on("leaveRoom", (roomId) => {
    console.log(`${socket.id} left room: ${roomId}`);
    socket.leave(roomId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      console.log("Message received:", data);
      const { roomId, text, senderId, receiverId } = data;

      if (!roomId || !text || !senderId || !receiverId) {
        console.log("Invalid message data");
        return;
      }

      const message = {
        roomId,
        senderId,
        receiverId,
        message: text,
        createdAt: Date.now(),
      };

      const messageRef = await addDoc(collection(db, "messages"), message);

      const savedMessage = {
        id: messageRef.id,
        ...message,
      };

      io.to(roomId).emit("newMessage", savedMessage);
      console.log("Message saved:", savedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("deleteMessage", (data) => {
    try {
      console.log("Delete event listened");
      console.log(data, 'this is the data');
      socket.broadcast.to(data.roomId).emit("deleteMessageInOthers", {
        id: data.id,
        roomId: data.roomId,
      });
      console.log("This message was deleted", data);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  });

  socket.on("typing", (data) => {
    console.log("server is listening the typing event");
    socket.broadcast.to(data.roomId).emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(
    `> Standalone Express Socket Server ready on http://localhost:${port}`,
  );
});
