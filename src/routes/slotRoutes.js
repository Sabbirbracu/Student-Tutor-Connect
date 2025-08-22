import express from "express";
import {
  bookSlot,
  cancelSlot,
  courseSlots,
  createSlot,
  deleteSlot,
  mySlots,
} from "../controllers/slotController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// public: list open slots for a course
router.get("/course/:courseId", courseSlots);

// tutor ops
router.post("/", protect, requireRole("tutor"), createSlot);
router.get("/mine", protect, requireRole("tutor", "student"), mySlots); // both can list own context

// booking
router.patch("/:id/book", protect, requireRole("student"), bookSlot);
router.patch(
  "/:id/cancel",
  protect,
  requireRole("student", "tutor"),
  cancelSlot
);

// manage
router.delete("/:id", protect, requireRole("tutor"), deleteSlot);

export default router;
