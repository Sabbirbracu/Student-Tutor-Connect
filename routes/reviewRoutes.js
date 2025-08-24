import express from "express";
import {
  createReview,
  getTutorReviews,
} from "../controllers/reviewController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get reviews for a specific StudentTutor
router.get("/tutor/:tutorId", getTutorReviews);

// Create a new review (only students can create)
router.post("/", protect, requireRole("student"), createReview);

export default router;
