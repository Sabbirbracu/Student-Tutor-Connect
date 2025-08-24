import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  createSlot,
  getMySlots,
  updateSlot,
  getSlotsForStudent,
} from "../controllers/slotController.js";

const router = express.Router();

// ======================
// Tutor Routes (Protected)
// ======================

// Create a slot (StudentTutor)
router.post("/", protect, requireRole("studentTutor"), createSlot);

// Get tutor's own slots
router.get("/mine", protect, requireRole("studentTutor"), getMySlots);

// Update a slot (optional)
router.patch("/:id", protect, requireRole("studentTutor"), updateSlot);

// ======================
// Public Route (Student access)
// ======================

// Get slots for a tutor (can filter by course)
router.get("/", getSlotsForStudent);

export default router;
