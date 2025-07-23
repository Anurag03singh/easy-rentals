import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  // Check if socket.io server is already initialized
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    cors: {
      origin: process.env.CLIENT_URL || "https://easy-rentals.vercel.app",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/api/socketio'
  });
  
  res.socket.server.io = io;

  let onlineUser = [];

  const addUser = (userId, socketId) => {
    const userExits = onlineUser.find((user) => user.userId === userId);
    if (!userExits) {
      onlineUser.push({ userId, socketId });
    }
  };

  const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return onlineUser.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("newUser", (userId) => {
      addUser(userId, socket.id);
    });

    socket.on("sendMessage", ({ receiverId, data }) => {
      const receiver = getUser(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      removeUser(socket.id);
    });
  });

  console.log('Socket server initialized');
  res.end();
}