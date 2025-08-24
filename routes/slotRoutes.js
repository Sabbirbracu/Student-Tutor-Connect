import express from "express";
import {
  createSlot,
  requestExtraSlot,
  updateExtraSlotRequest,
  viewSlots,
} from "../controllers/slotController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// StudentTutor creates slots
router.post("/", protect, requireRole("studentTutor"), createSlot);

// Students view slots
router.get("/", protect, requireRole("student"), viewSlots);

// Student requests extra slot
router.post("/extra", protect, requireRole("student"), requestExtraSlot);

// StudentTutor approves/rejects extra slot
router.patch(
  "/extra/:requestId",
  protect,
  requireRole("studentTutor"),
  updateExtraSlotRequest
);

export default router;
