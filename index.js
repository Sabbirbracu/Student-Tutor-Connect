import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import extraRequestRoutes from "./src/routes/extraRequestRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import slotRoutes from "./src/routes/slotRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/extra-requests", extraRequestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// MongoDB connection + server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
