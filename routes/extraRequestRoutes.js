import express from "express";
import {
  createExtraRequest,
  getMyExtraRequests,
  getTutorExtraRequests,
  updateExtraRequestStatus,
} from "../controllers/extraRequestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/extra-requests
router.post("/", protect, createExtraRequest);

// GET /api/extra-requests/my-requests (for students)
router.get("/my-requests", protect, getMyExtraRequests);

// GET /api/extra-requests/tutor-requests (for student tutors)
router.get("/tutor-requests", protect, getTutorExtraRequests);

// PATCH /api/extra-requests/:id (for student tutors to approve/reject)
router.patch("/:id", protect, updateExtraRequestStatus);

export default router;
