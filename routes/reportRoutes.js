import express from "express";
import {
  actOnReport,
  createReport,
  listReports,
} from "../controllers/reportController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requireRole("student", "tutor"), createReport);
router.get("/", protect, requireRole("admin"), listReports);
router.patch("/:id/action", protect, requireRole("admin"), actOnReport);

export default router;
