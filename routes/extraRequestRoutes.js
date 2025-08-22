import express from "express";
import {
  actOnExtraRequest,
  createExtraRequest,
  myExtraRequests,
} from "../controllers/extraRequestController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requireRole("student"), createExtraRequest);
router.get("/mine", protect, requireRole("student", "tutor"), myExtraRequests);
router.patch("/:id", protect, requireRole("tutor"), actOnExtraRequest);

export default router;
