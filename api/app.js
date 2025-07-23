import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import consolidatedRoutes from "./routes/consolidated.js";

const app = express();

// Allow requests from any origin in production or from localhost in development
const allowedOrigins = [process.env.CLIENT_URL, 'https://easy-rentals.vercel.app'];
app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Use consolidated routes
app.use("/api", consolidatedRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8800;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  });
}

// Export for serverless environment
export default app;
