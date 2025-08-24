import express from "express";
import {
  actOnReport,
  createReport,
  listReports,
} from "../controllers/reportController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================
// 1️⃣ Create a report (Student or StudentTutor)
// ============================
router.post("/", protect, requireRole("student", "studentTutor"), createReport);

// ============================
// 2️⃣ List reports (Admin only)
// ============================
router.get("/", protect, requireRole("admin"), listReports);

// ============================
// 3️⃣ Act on a report (Admin only)
// ============================
router.patch("/:id/action", protect, requireRole("admin"), actOnReport);

export default router;
