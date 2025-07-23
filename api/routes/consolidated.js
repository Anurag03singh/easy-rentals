import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  register,
  login,
  logout,
  getUser,
  savePost,
  getPosts,
  getPost,
  createPost,
  getChats,
  createChat,
  getMessages,
  createMessage
} from "../controllers/consolidated.js";

const router = express.Router();

// Auth routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

// User routes
router.get("/users/:id", getUser);
router.post("/users/save", verifyToken, savePost);

// Post routes
router.get("/posts", getPosts);
router.get("/posts/:id", getPost);
router.post("/posts", verifyToken, createPost);

// Chat routes
router.get("/chats", verifyToken, getChats);
router.post("/chats", verifyToken, createChat);

// Message routes
router.get("/messages/:chatId", verifyToken, getMessages);
router.post("/messages", verifyToken, createMessage);

export default router;