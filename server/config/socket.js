import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket) => {
  try {
  //  console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
  //  console.log("User ID:", userId);

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // Emit event to all connected clients .. broadcast the message
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      try {
        //console.log("A user disconnected", socket.id);
        if (userId) {
          delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      } catch (disconnectError) {
        console.error("Error handling disconnect:", disconnectError);
      }
    });

  } catch (error) {
    console.error("Error in socket connection:", error);
  }
});



export { io, app, server };
