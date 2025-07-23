import { Server } from "socket.io";

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const port = process.env.PORT || 4000;

const io = new Server({
  cors: {
    origin: [clientUrl, "https://easy-rentals.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

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
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(port);
console.log(`Socket server running on port ${port}`);
