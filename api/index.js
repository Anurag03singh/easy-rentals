import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/consolidated.js";
import { userRoutes } from "./routes/consolidated.js";
import { postRoutes } from "./routes/consolidated.js";
import { chatRoutes } from "./routes/consolidated.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Consolidated routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chats", chatRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// For Vercel serverless deployment
export default app;

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8800;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}