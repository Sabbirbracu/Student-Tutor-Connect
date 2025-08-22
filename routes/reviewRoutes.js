import express from "express";
import {
  createReview,
  getTutorReviews,
} from "../controllers/reviewController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/tutor/:tutorId", getTutorReviews); // public view
router.post("/", protect, requireRole("student"), createReview);

export default router;
